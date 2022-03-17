import { EntityRepository, Repository } from 'typeorm';
import { Order } from '../entities/order.entity';

@EntityRepository(Order)
export class OrderRepository extends Repository<Order> {
  async getOrderInformation(orderId: string): Promise<Order> {
    return this.findOne({
      where: { uuid: orderId },
      relations: [
        'owner',
        'sale',
        'cartItems',
        'cartItems.product',
        'cartItems.product.sales',
        'cartItems.product.collections',
        'cartItems.product.collections.sales',
      ],
      join: {
        alias: 'order',
        leftJoinAndSelect: {
          cartItems: 'order.cartItems',
          product: 'cartItems.product',
          productSale: 'product.sales',
          collections: 'product.collections',
          collectionSales: 'collections.sales',
        },
      },
    });
  }
}
