import { Order } from '../../orders/entities/order.entity';
import { EntityRepository, Repository } from 'typeorm';
import { OrderHistory } from '../entities/order-history.entity';

@EntityRepository(OrderHistory)
export class OrderHistoryRepository extends Repository<OrderHistory> {
  async createHistoryBaseOnOrder(order: Order): Promise<OrderHistory> {
    const orderHistory = new OrderHistory(order);
    const newHist = this.create(orderHistory);
    return this.save(orderHistory);
  }
}
