import { IsUUID, Max, Min } from 'class-validator';
import { CartItem } from 'src/cart-item/entities/cart-item.entity';
import { Collection } from 'src/collections/entities/collection.entity';
import { Color } from 'src/colors/entities/color.entity';
import { Coupon } from 'src/coupons/entities/coupon.entity';
import { Material } from 'src/materials/entities/material.entity';
import { ProductStatus } from 'src/product-status/entities/product-status.entity';
import { Review } from 'src/reviews/entities/review.entity';
import { Size } from 'src/sizes/entities/size.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CreateProductDto } from '../dto/create-product.dto';
import { ProductColection } from './product_collection.entity';
import { ProductMaterial } from './product_material.entity';

@Entity()
export class Product extends BaseEntity {
  constructor(
    name: string,
    image: string,
    description: string,
    price: number,
    color: Color,
    status: ProductStatus,
    size: Size,
  ) {
    super();
    this.name = name;
    this.image = image;
    this.description = description;
    this.price = price;
    this.color = color;
    this.productStatus = status;
    this.size = size;
  }

  @PrimaryGeneratedColumn('uuid', { name: 'uuid' })
  @IsUUID()
  uuid: string;

  @Column('varchar', { length: 512 })
  name: string;

  @Column('varchar', { length: 512, nullable: true })
  nameInFrench?: string;

  @Column('varchar', { length: 512, nullable: true })
  nameInVietnamese?: string;

  @Column('text')
  description?: string;

  @Column('text', { nullable: true })
  descriptionInFrench?: string;

  @Column('text', { nullable: true })
  descriptionInVietnamese?: string;

  @Column('double')
  @Min(0)
  price: number;

  @Column('double')
  @Max(1)
  @Min(0)
  saleOf: number = 0;

  @Column('text')
  image: string;

  @Column('text', { nullable: true })
  image1?: string;

  @Column('text', { nullable: true })
  image2?: string;

  @Column('text', { nullable: true })
  image3?: string;

  @Column('text', { nullable: true })
  image4?: string;

  @Column('text', { nullable: true })
  image5?: string;

  @ManyToOne(() => ProductStatus, (status) => status.product, {
    onDelete: 'SET NULL',
  })
  productStatus: ProductStatus;

  @ManyToOne(() => Size, (size) => size.product, { onDelete: 'SET NULL' })
  size: Size;

  @ManyToOne((type) => Color, (color) => color.product, {
    onDelete: 'SET NULL',
  })
  color: Color;

  @ManyToOne((type) => Coupon, (coupon) => coupon.product, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  // @JoinColumn({ name: 'couponUuid' })
  coupon?: Coupon;

  @OneToMany(
    () => ProductMaterial,
    (prodAndMaterial) => prodAndMaterial.product,
    { nullable: true },
  )
  productMaterial: ProductMaterial;

  @OneToMany(
    () => ProductColection,
    (prodAndMaterial) => prodAndMaterial.product,
    { nullable: true },
  )
  productColection: ProductColection;

  @OneToMany(() => Review, (review) => review.product, { onDelete: 'SET NULL' })
  reviews: Review[];

  @OneToMany(() => CartItem, (cartItem) => cartItem.product, {
    onDelete: 'SET NULL',
  })
  cartItems: CartItem[];

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
