import { CartItem } from '../../cart-item/entities/cart-item.entity';
import { OrderStatus } from '../../common/entity-enum';
import { Order } from '../../orders/entities/order.entity';
import { EntityRepository, Repository } from 'typeorm';
import { Product } from '../entities/product.entity';

@EntityRepository(Product)
export class ProductRepository extends Repository<Product> {
  async updateProductQuantityByOrder(
    order: Order,
    prevOrderStatus: OrderStatus,
  ) {
    if (order.cartItems?.length == 0) {
      throw 'No found any item in order';
    }

    const updateProductPromises = order.cartItems.map((item) => {
      if (!item.product) {
        throw 'Item have to contain product';
      }
      const product = item.product;
      switch (order.status) {
        case OrderStatus.PENDING:
        case OrderStatus.SHIPPING:
        case OrderStatus.COMPLETED:
        case undefined:
          if (
            [
              OrderStatus.CANCELED,
              OrderStatus.REFUNDED,
              OrderStatus.REJECTED,
            ].includes(prevOrderStatus)
          ) {
            product.quantity -= item.quantity;
          }

          break;
        case OrderStatus.CANCELED:
        case OrderStatus.REFUNDED:
        case OrderStatus.REJECTED:
          if (
            ![
              OrderStatus.CANCELED,
              OrderStatus.REFUNDED,
              OrderStatus.REJECTED,
            ].includes(prevOrderStatus)
          ) {
            product.quantity += item.quantity;
          }
          break;
      }

      return product.save();
    });
    await Promise.all(updateProductPromises);
  }
}
