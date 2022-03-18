import {
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CartItem } from '../cart-item/entities/cart-item.entity';
import { CartItemRepository } from '../cart-item/repositories/cart-item.repository';
import { CartRepository } from '../carts/repositories/cart.repository';
import { CommonService } from '../common/common-services.service';
import { OrderStatus, SaleType, UserRoles } from '../common/entity-enum';
import ExceptionCode from '../exception-code';
import { OrderHistoryRepository } from '../order-history/repositories/order-history.repository';
import { ProductRepository } from '../products/repositories/product.repository';
import { Sale } from '../sales/entities/sale.entity';
import { SaleRepository } from '../sales/repositories/sale.repository';
import { UserProfileRepository } from '../user-profile/repositories/user-profile.respository';
import { User } from '../users/entities/user.entity';
import { getConnection, IsNull } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { OrderRepository } from './repositories/order.repository';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class OrdersService extends CommonService<Order> {
  constructor(
    @InjectRepository(OrderRepository)
    private readonly orderRepository: OrderRepository,
    @InjectRepository(CartItemRepository)
    private readonly cartItemRepository: CartItemRepository,
    @InjectRepository(SaleRepository)
    private readonly saleRepository: SaleRepository,
    @InjectRepository(UserProfileRepository)
    private readonly userProfileRepository: UserProfileRepository,
    @InjectRepository(CartRepository)
    private readonly cartRepository: CartRepository,
  ) {
    super(orderRepository);
  }

  async create(
    user: User,
    ordeSaleId?: string,
    returnInfo: boolean = false,
  ): Promise<Order> {
    const isMyCartEmpty = await this.cartRepository.isMyCartEmpty(user);
    if (!returnInfo && isMyCartEmpty) {
      throw new NotFoundException(ExceptionCode.CART.NO_ITEM_IN_CART);
    }

    !returnInfo && (await this._checkUserProfile(user.uuid));

    const items = await this.cartItemRepository.find({
      relations: ['owner', 'order', 'product'],
      where: {
        owner: { uuid: user.uuid },
        isSelected: true,
        order: IsNull(),
      },
    });

    if ((!items || items.length == 0) && !returnInfo) {
      throw new NotFoundException(ExceptionCode.CART_ITEM.NO_ITEM_SELECTED);
    }

    !returnInfo && this._checkProductInStore(items);

    let orderSale: Sale = undefined;

    if (ordeSaleId) {
      const sales = await this.saleRepository.getAvailableSaleByType(
        SaleType.ORDER,
      );
      orderSale = sales.find((sale) => sale.uuid == ordeSaleId);
    }

    const newOrder = new Order(items, user, orderSale);

    if (returnInfo) {
      return newOrder;
    }

    return this._executeCreateOrderTransaction(items, newOrder, user);
  }

  async findUserOrders(user: User): Promise<Order[]> {
    return this.findAvailable(
      { cond: `order.owner.uuid = '${user.uuid}'` },
      {
        relations: ['owner'],
        join: {
          alias: 'order',
          leftJoinAndSelect: {
            owner: 'order.owner',
          },
        },
      },
    );
  }

  async findUserOrderById(id: string): Promise<Order> {
    const order = await this.findOneAvailable(
      { cond: `order.uuid = '${id}'` },
      { relations: ['sale'], join: { alias: 'order' } },
    );
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async findOrderById(id: string) {
    const order = await this.findOne(id, undefined, { relations: ['sale'] });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async updateOrderStatus(
    orderId: string,
    updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: `order.uuid = '${orderId}'`,
      join: {
        alias: 'order',
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found!');
    }

    const { cancelReason, rejectReason, orderStatus } = updateOrderDto;
    const previousOrderStatus = order.status;

    order.cancelReason = cancelReason;
    order.rejectReason = rejectReason;
    order.status = orderStatus;

    return this._updateOrderStatusTransaction(order, previousOrderStatus);
  }

  async cancelOrder(orderId: string, user: User, cancelReason: string) {
    const order = await this.orderRepository.findOne({
      where: `order.owner.uuid = '${user.uuid}' AND order.uuid = '${orderId}'`,
      relations: ['owner'],
      join: {
        alias: 'order',
        leftJoinAndSelect: {
          owner: 'order.owner',
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found!');
    }
    const previousOrderStatus = order.status;

    if (user.uuid !== order.owner.uuid) {
      throw new UnauthorizedException(
        'Only owner of the order can cancel this order',
      );
    }

    if (order.status != OrderStatus.PENDING) {
      throw new NotAcceptableException('Only pending order can be canceled');
    }

    order.cancelReason = cancelReason;
    order.status = OrderStatus.CANCELED;

    return this._updateOrderStatusTransaction(order, previousOrderStatus);
  }

  private async _checkUserProfile(userId: string) {
    const userProfile = await this.userProfileRepository.findOne({
      relations: ['owner', 'owner.addresses'],
      where: {
        owner: { uuid: userId },
      },
    });

    if (!userProfile) {
      throw new NotFoundException(
        ExceptionCode.USER_PROFILE.NEED_PROFILE_TO_PROCESS,
      );
    }

    if (
      userProfile?.owner?.addresses?.length == 0 ||
      !userProfile?.phone ||
      (!userProfile?.lastName && !userProfile?.firstName)
    ) {
      throw new NotFoundException(
        ExceptionCode.USER_PROFILE.MISSING_INFO_TO_ORDER,
      );
    }
  }

  private _checkProductInStore(cartItems: CartItem[]) {
    const notEnoughProduct = cartItems.find((item) => {
      return item.product.quantity < item.quantity;
    });

    if (notEnoughProduct)
      throw new NotAcceptableException({
        ...ExceptionCode.CART_ITEM.ITEM_QTY_MORE_THAN_STORE_HAVE,
        remain: notEnoughProduct.product.quantity,
        order: notEnoughProduct.quantity,
        itemId: notEnoughProduct.uuid,
      });
  }

  private async _executeCreateOrderTransaction(
    cartItems: CartItem[],
    newOrder: Order,
    user: User,
  ) {
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();

    await queryRunner.startTransaction();

    try {
      const [, , , createdOrder] = await Promise.all([
        queryRunner.manager
          .getCustomRepository(CartRepository)
          .deleteSelectedItems(user),

        queryRunner.manager
          .getCustomRepository(CartItemRepository)
          .updateCartItemOrder(cartItems, newOrder),

        queryRunner.manager
          .getCustomRepository(ProductRepository)
          .updateProductQuantityByOrder(newOrder, newOrder.status),

        queryRunner.manager.getCustomRepository(OrderRepository).save(newOrder),
      ]);

      /**
       * Get back order with deep information to save as order history
       */
      const orderDeepInfomation = await queryRunner.manager
        .getCustomRepository(OrderRepository)
        .getOrderInformation(createdOrder.uuid);

      const orderHistory = await queryRunner.manager
        .getCustomRepository(OrderHistoryRepository)
        .createHistoryBaseOnOrder(orderDeepInfomation);

      /**
       * Add order history to order
       */
      createdOrder.orderHistory = orderHistory;
      await queryRunner.manager
        .getCustomRepository(OrderRepository)
        .save(createdOrder);

      await queryRunner.commitTransaction();

      return createdOrder;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  private async _updateOrderStatusTransaction(
    order: Order,
    prevOrderStatus: OrderStatus,
  ): Promise<Order> {
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();

    await queryRunner.startTransaction();

    try {
      const [, updatedOrder] = await Promise.all([
        queryRunner.manager
          .getCustomRepository(ProductRepository)
          .updateProductQuantityByOrder(order, prevOrderStatus),

        queryRunner.manager.save(order),
      ]);

      await queryRunner.commitTransaction();

      return updatedOrder;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
