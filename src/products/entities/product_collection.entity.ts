import { Collection } from 'src/collections/entities/collection.entity';
import { BaseEntity, Entity, ManyToOne } from 'typeorm';
import { Product } from './product.entity';

@Entity('m2m_product_collection')
export class ProductColection extends BaseEntity {
  @ManyToOne((type) => Product, (prod) => prod.productColection, {
    primary: true,
    eager: true,
    onDelete: 'CASCADE',
  })
  product: Product;

  @ManyToOne((type) => Collection, (col) => col.productCollection, {
    primary: true,
    eager: true,
    onDelete: 'CASCADE',
  })
  collection: Collection;
}
