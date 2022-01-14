import { InjectRepository } from '@nestjs/typeorm';
import moment from 'moment';
import { SaleType } from 'src/common/entity-enum';
import { SaleRepository } from 'src/sales/repositories/sale.repository';
import { User } from 'src/users/entities/user.entity';
import { CalculatePriceInfo, DEFAULT_DATETIME_FORMAT } from 'src/utils';
import {
  EntityRepository,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { Cart } from '../entities/cart.entity';

@EntityRepository(Cart)
export class CartRepository extends Repository<Cart> {
  constructor(
    @InjectRepository(CartRepository)
    private readonly cartRepository: CartRepository,
    @InjectRepository(SaleRepository)
    private readonly saleRepository: SaleRepository,
  ) {
    super();
  }
  async getPriceInformation(user: User): Promise<CalculatePriceInfo> {
    const cart = await this.cartRepository.findOne({
      relations: [
        'cartItems',
        'cartItems.product',
        'cartItems.product.collections',
        'cartItems.product.sales',
        'cartItems.product.collections.sales',
        'owner',
      ],
      where: { owner: { uuid: user.uuid } },
    });

    if (!cart) {
      return undefined;
    }

    const orderSales = await this.saleRepository.find({
      saleType: SaleType.ORDER,
      startedDate: LessThanOrEqual(
        moment().utc().format(DEFAULT_DATETIME_FORMAT),
      ),
      expiredDate: MoreThanOrEqual(
        moment().utc().format(DEFAULT_DATETIME_FORMAT),
      ),
    });

    return cart.getCartPrice(orderSales);
  }
}
