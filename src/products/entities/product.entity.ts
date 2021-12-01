import { IsUUID, Max, Min } from 'class-validator';
import { CartItem } from 'src/cart-item/entities/cart-item.entity';
import { Collection } from 'src/collections/entities/collection.entity';
import { Color } from 'src/colors/entities/color.entity';
import { RootEntity } from 'src/root-entity.entity';
import { Coupon } from 'src/coupons/entities/coupon.entity';
import { Material } from 'src/materials/entities/material.entity';
import { ProductStatus } from 'src/product-status/entities/product-status.entity';
import { Review } from 'src/reviews/entities/review.entity';
import { Size } from 'src/sizes/entities/size.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { M2MProductColection } from './product_collection.entity';
import { M2MProductMaterial } from './product_material.entity';

@Entity()
export class Product extends RootEntity {
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

  @Column('varchar', { length: 512, unique: true })
  name: string;

  @Column('varchar', { length: 512, nullable: true, unique: true })
  nameInFrench?: string;

  @Column('varchar', { length: 512, nullable: true, unique: true })
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
    eager: true,
  })
  productStatus: ProductStatus;

  @ManyToOne(() => Size, (size) => size.product, {
    onDelete: 'SET NULL',
    eager: true,
  })
  size: Size;

  @ManyToOne((type) => Color, (color) => color.product, {
    onDelete: 'SET NULL',
    eager: true,
  })
  color: Color;

  @ManyToOne((type) => Coupon, (coupon) => coupon.product, {
    nullable: true,
    onDelete: 'SET NULL',
    eager: true,
  })
  coupon?: Coupon;

  @OneToMany(
    () => M2MProductMaterial,
    (prodAndMaterial) => prodAndMaterial.product,
    { nullable: true },
  )
  productMaterial?: M2MProductMaterial;

  @OneToMany(
    () => M2MProductColection,
    (prodAndMaterial) => prodAndMaterial.product,
    { nullable: true },
  )
  productColection?: M2MProductColection;

  @OneToMany(() => Review, (review) => review.product, { onDelete: 'SET NULL' })
  reviews: Review[];

  @OneToMany(() => CartItem, (cartItem) => cartItem.product, {
    onDelete: 'SET NULL',
  })
  cartItems: CartItem[];
}
