import { Material } from 'src/materials/entities/material.entity';
import { BaseEntity, Entity, ManyToOne } from 'typeorm';
import { Product } from './product.entity';

@Entity('m2m_product_material')
export class ProductMaterial extends BaseEntity {
  @ManyToOne((type) => Product, (prod) => prod.productMaterial, {
    primary: true,
    eager: true,
    onDelete: 'CASCADE',
  })
  product: Product;

  @ManyToOne((type) => Material, (material) => material.productMaterial, {
    primary: true,
    eager: true,
    onDelete: 'CASCADE',
  })
  material: Material;
}
