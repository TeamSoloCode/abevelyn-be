import { CartItem } from 'src/cart-item/entities/cart-item.entity';
import { EntityRepository, Repository } from 'typeorm';
import { Product } from '../entities/product.entity';

@EntityRepository(Product)
export class ProductRepository extends Repository<Product> {
  async reduceProductQuantityByItems(items: CartItem[]) {
    const updateProductPromises = items.map((item) => {
      if (!item.product) {
        throw 'Item have to contain product';
      }
      const product = item.product;
      product.quantity -= item.quantity;
      return product.save();
    });
    await Promise.all(updateProductPromises);
  }
}
