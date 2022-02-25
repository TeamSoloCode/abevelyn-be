import { map } from 'lodash';
import { Order } from 'src/orders/entities/order.entity';
import { EntityRepository, In, Repository } from 'typeorm';
import { CartItem } from '../entities/cart-item.entity';

@EntityRepository(CartItem)
export class CartItemRepository extends Repository<CartItem> {
  async updateCartItemOrder(items: CartItem[], order: Order) {
    return await this.update(
      { uuid: In(map(items, 'uuid')) },
      { order: { uuid: order.uuid }, isSelected: false },
    );
  }
}
