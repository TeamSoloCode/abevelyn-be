import { IsUUID, Max, Min } from 'class-validator';
import { Color } from 'src/colors/entities/color.entity';
import { Material } from 'src/materials/entities/material.entity';
import { ProductStatus } from 'src/product-status/entities/product-status.entity';
import { Size } from 'src/sizes/entities/size.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductColection } from './product_collection.entity';
import { ProductMaterial } from './product_material.entity';

@Entity()
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'uuid' })
  @IsUUID()
  uuid: string;

  @Column('double')
  @Min(0)
  price: number;

  @Column('double')
  @Max(1)
  @Min(0)
  saleOf: number;

  @Column('text')
  image: string;

  @Column('text', { nullable: true })
  image1: string;

  @Column('text', { nullable: true })
  image2: string;

  @Column('text', { nullable: true })
  image3: string;

  @Column('text', { nullable: true })
  image4: string;

  @Column('text', { nullable: true })
  image5: string;

  @OneToOne(() => ProductStatus)
  @JoinColumn({ name: 'product_status_uuid' })
  productStatus: ProductStatus;

  @OneToOne(() => Size)
  @JoinColumn({ name: 'product_size_uuid' })
  size: Size;

  @OneToOne((type) => Color)
  @JoinColumn({ name: 'product_color_uuid' })
  color: Color;

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

  /**
   * -----------------------------------------------------
   */
  private _createdAt: Date;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public get createdAt(): Date {
    return this._createdAt;
  }

  public set createdAt(value: Date) {
    this._createdAt = value;
  }

  /**
   * -----------------------------------------------------
   */
  private _updatedAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public get updatedAt(): Date {
    return this._updatedAt;
  }

  public set updatedAt(value: Date) {
    this._updatedAt = value;
  }
}
