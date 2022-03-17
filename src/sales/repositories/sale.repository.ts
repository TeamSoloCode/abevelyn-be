import * as moment from 'moment';
import {
  EntityRepository,
  Repository,
  MoreThanOrEqual,
  LessThanOrEqual,
} from 'typeorm';
import { Sale } from '../entities/sale.entity';
import { DEFAULT_DATETIME_FORMAT } from '../../utils';
import { SaleType } from '../../common/entity-enum';

@EntityRepository(Sale)
export class SaleRepository extends Repository<Sale> {
  async getAvailableSaleByType(saleType?: SaleType): Promise<Sale[]> {
    const conditionByType = saleType ? { saleType } : {};

    return await this.find({
      join: {
        alias: 'sale',
      },
      where: {
        ...conditionByType,
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
