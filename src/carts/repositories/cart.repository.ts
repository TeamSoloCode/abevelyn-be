import { User } from 'src/users/entities/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { Cart } from '../entities/cart.entity';

@EntityRepository(Cart)
export class CartRepository extends Repository<Cart> {
  async isMyCartEmpty(owner: User): Promise<boolean> {
    const cart = await this.findOne({
      relations: ['cartItems'],
      where: { owner: { uuid: owner.uuid } },
    });

    return cart.cartItems.length == 0;
  }

  async deleteSelectedItems(owner: User) {
    const cart = await this.findOne({
      relations: ['cartItems', 'owner'],
      where: `cartItems.order.uuid IS NULL AND cart.owner.uuid = '${owner.uuid}'`,
      join: {
        alias: 'cart',
        leftJoinAndSelect: {
          cartItems: 'cart.cartItems',
        },
      },
    });

    cart.cartItems = cart.cartItems.filter((item) => !item.isSelected);

    await cart.save();
  }
}
