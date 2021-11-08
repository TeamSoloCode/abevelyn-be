import { EntityRepository, Repository } from 'typeorm';
import { Product } from '../entities/product.entity';

@EntityRepository(Product)
export class ProductRepository extends Repository<Product> {
  async createProduct(product: Product) {
    try {
      await this.save(product);
    } catch (err) {
      throw err;
    }
  }
}
