import { IsUUID, Max, Min } from 'class-validator';
import { CartItem } from 'src/cart-item/entities/cart-item.entity';
import { Collection } from 'src/collections/entities/collection.entity';
import { Color } from 'src/colors/entities/color.entity';
import { RootEntity } from 'src/common/root-entity.entity';
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
import { ProductColection } from './product_collection.entity';
import { ProductMaterial } from './product_material.entity';

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
    onDelete: 'CASCADE',
  })
  productStatus: ProductStatus;

  @ManyToOne(() => Size, (size) => size.product, { onDelete: 'CASCADE' })
  size: Size;

  @ManyToOne((type) => Color, (color) => color.product, {
    onDelete: 'CASCADE',
  })
  color: Color;

  @ManyToOne((type) => Coupon, (coupon) => coupon.product, {
    nullable: true,
    onDelete: 'CASCADE',
  })
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

  @OneToMany(() => Review, (review) => review.product, { onDelete: 'CASCADE' })
  reviews: Review[];

  @OneToMany(() => CartItem, (cartItem) => cartItem.product, {
    onDelete: 'CASCADE',
  })
  cartItems: CartItem[];
}
