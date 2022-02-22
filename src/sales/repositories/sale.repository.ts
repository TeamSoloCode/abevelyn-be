import * as moment from 'moment';
import {
  EntityRepository,
  Repository,
  MoreThanOrEqual,
  LessThanOrEqual,
} from 'typeorm';
import { Sale } from '../entities/sale.entity';
import { DEFAULT_DATETIME_FORMAT } from 'src/utils';
import { SaleType } from 'src/common/entity-enum';

@EntityRepository(Sale)
export class SaleRepository extends Repository<Sale> {
  async getAvailableOrderSales(): Promise<Sale[]> {
    return await this.find({
      join: {
        alias: 'sale',
      },
      where: {
        saleType: SaleType.ORDER,
        startedDate: LessThanOrEqual(
          moment().utc().format(DEFAULT_DATETIME_FORMAT),
        ),
        expiredDate: MoreThanOrEqual(
          moment().utc().format(DEFAULT_DATETIME_FORMAT),
        ),
        available: true,
        deleted: false,
      },
    });
  }
}
