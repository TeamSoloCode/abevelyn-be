import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
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
  constructor() {
    super();
  }
}
