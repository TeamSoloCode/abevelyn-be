import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { CommonService } from '../common/common-services.service';
import { FetchDataQuery } from '../common/fetch-data-query';
import { OrderHistory } from './entities/order-history.entity';
import { OrderHistoryRepository } from './repositories/order-history.repository';
import { toString } from 'lodash';

@Injectable()
export class OrderHistoryService extends CommonService<OrderHistory> {
  constructor(
    @InjectRepository(OrderHistoryRepository)
    private readonly orderHistoryRepository: OrderHistoryRepository,
  ) {
    super(orderHistoryRepository);
  }

  async fetchAllOrderHistory(query: FetchDataQuery) {
    return this.findAll(query, { relations: ['order'] });
  }

  async fetchAllMyOrderHist(query: FetchDataQuery, user: User) {
    return this.findAll(
      {
        ...query,
        cond:
          (query.cond ?? '') +
          (query.cond ? ' AND ' : '') +
          `order.owner.uuid = '${user.uuid}'`,
      },
      {
        relations: ['order'],
        join: {
          alias: 'orderHist',
          leftJoinAndSelect: { order: 'orderHist.order' },
        },
      },
    );
  }

  async fetchOrderById(id: string, user: User = undefined) {
    const orderHist = await this.findOne(id, user, { relations: ['order'] });
    if (!orderHist) {
      throw new NotFoundException('Order history not found!');
    }
    return orderHist;
  }
}
