import { IsUUID } from 'class-validator';
import { Material } from 'src/materials/entities/material.entity';
import { ProductStatus } from 'src/product-status/entities/product-status.entity';
import { Size } from 'src/sizes/entities/size.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductColection } from './product_collection.entity';
import { ProductMaterial } from './product_material.entity';

@Entity()
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'uuid' })
  @IsUUID()
  uuid: string;

  @Column('text')
  image: string;

  @Column('text')
  image1: string;

  @Column('text')
  image2: string;

  @Column('text')
  image3: string;

  @Column('text')
  image4: string;

  @Column('text')
  image5: string;

  @OneToOne(() => ProductStatus)
  @JoinColumn({ name: 'product_status' })
  productStatus: ProductStatus;

  @OneToOne(() => Size)
  @JoinColumn({ name: 'product_size' })
  size: Size;

  @OneToMany(
    () => ProductMaterial,
    (prodAndMaterial) => prodAndMaterial.product,
  )
  productMaterial: ProductMaterial;

  @OneToMany(
    () => ProductColection,
    (prodAndMaterial) => prodAndMaterial.product,
  )
  productColection: ProductColection;
}
