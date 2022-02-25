import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItem } from 'src/cart-item/entities/cart-item.entity';
import { CartItemRepository } from 'src/cart-item/repositories/cart-item.repository';
import { CommonService } from 'src/common/common-services.service';
import { SaleType, UserRoles } from 'src/common/entity-enum';
import ExceptionCode from 'src/exception-code';
import { Sale } from 'src/sales/entities/sale.entity';
import { SaleRepository } from 'src/sales/repositories/sale.repository';
import { UserProfileRepository } from 'src/user-profile/repositories/user-profile.respository';
import { User } from 'src/users/entities/user.entity';
import {
  getConnection,
  In,
  IsNull,
  Transaction,
  TransactionRepository,
} from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { OrderRepository } from './repositories/order.repository';

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
  ) {
    super(orderRepository);
  }

  @Transaction()
  async create(
    user: User,
    ordeSaleId?: string,
    returnInfo: boolean = false,
  ): Promise<Order> {
    const userProfile = await this.userProfileRepository.findOne({
      relations: ['addresses'],
      where: {
        owner: { uuid: user.uuid },
      },
    });

    if (!userProfile) {
      throw new NotFoundException(
        ExceptionCode.USER_PROFILE.NEED_PROFILE_TO_PROCESS,
      );
    }

    if (
      userProfile.addresses.length == 0 ||
      !userProfile.phone ||
      (!userProfile.lastName && !userProfile.firstName)
    ) {
      throw new NotFoundException(
        ExceptionCode.USER_PROFILE.MISSING_INFO_TO_ORDER,
      );
    }

    const items = await this.cartItemRepository.find({
      relations: ['owner', 'order'],
      where: {
        owner: { uuid: user.uuid },
        isSelected: true,
        order: IsNull(),
      },
    });

    if ((!items || items.length == 0) && !returnInfo) {
      throw new NotFoundException(ExceptionCode.CART_ITEM.NO_ITEM_SELECTED);
    }

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

    return this._executeCreateOrderTransaction(items, newOrder);
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
    return this.findOneAvailable({ cond: `uuid = '${id}'` });
  }

  async updateUserOrder(
    orderId: string,
    user: User,
    updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: `order.owner.uuid = '${user.uuid}'`,
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
    const { cancelReason, rejectReason } = updateOrderDto;

    if (cancelReason && user.role !== UserRoles.USER) {
      throw new UnauthorizedException('Only user can update cancel reason');
    } else {
      order.cancelReason = cancelReason;
    }

    if (rejectReason && user.role === UserRoles.USER) {
      throw new UnauthorizedException('Only admin can update reject reason');
    } else {
      order.rejectReason = rejectReason;
    }

    return order.save();
  }

  private async _executeCreateOrderTransaction(
    cartItems: CartItem[],
    newOrder: Order,
  ) {
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();

    await queryRunner.startTransaction();

    try {
      await queryRunner.manager
        .getCustomRepository(CartItemRepository)
        .updateCartItemOrder(cartItems, newOrder);

      const createdOrder = await queryRunner.manager.save(newOrder);

      await queryRunner.commitTransaction();

      return createdOrder;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(err);
    } finally {
      await queryRunner.release();
    }
  }
}
