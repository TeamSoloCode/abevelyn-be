import { IsUUID } from 'class-validator';
import { Product } from 'src/products/entities/product.entity';
import { ProductMaterial } from 'src/products/entities/product_material.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Material extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  uuid: string;

  @Column('varchar', { length: 256 })
  name: string;

  @Column('text')
  description: string;

  @OneToMany(
    () => ProductMaterial,
    (prodAndMaterial) => prodAndMaterial.material,
  )
  productMaterial: ProductMaterial;
}
