import { NotAcceptableException } from '@nestjs/common';
import { IsUUID, Max, Min } from 'class-validator';
import * as moment from 'moment';
import { CartItem } from '../../cart-item/entities/cart-item.entity';
import { Collection } from '../../collections/entities/collection.entity';
import { Color } from '../../colors/entities/color.entity';
import { SaleType, SaleUnit } from '../../common/entity-enum';
import { RootEntity } from '../../common/root-entity.entity';
import { Coupon } from '../../coupons/entities/coupon.entity';
import { Material } from '../../materials/entities/material.entity';
import { ProductStatus } from '../../product-status/entities/product-status.entity';
import { Review } from '../../reviews/entities/review.entity';
import { Sale } from '../../sales/entities/sale.entity';
import { Size } from '../../sizes/entities/size.entity';
import { CalculatePriceInfo } from '../../utils';
import {
  BeforeUpdate,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('product')
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

  @Column('int', { default: 1 })
  quantity: number;

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
  })
  coupon?: Coupon;

  @OneToMany(() => Review, (review) => review.product, { onDelete: 'SET NULL' })
  reviews: Review[];

  @OneToMany(() => CartItem, (cartItem) => cartItem.product, {
    onDelete: 'SET NULL',
  })
  cartItems: CartItem[];

  @ManyToMany((type) => Collection, (col) => col.products, { eager: true })
  @JoinTable()
  collections: Collection[];

  @ManyToMany((type) => Material, (material) => material.products, {
    eager: true,
  })
  @JoinTable()
  materials?: Material[];

  @ManyToMany(() => Sale, (sale) => sale.products, { eager: true })
  sales: Sale[];

  getPrice = (): CalculatePriceInfo => {
    let totalSaleAsCurrency = 0;
    let totalSaleAsPercentage = 0;

    let productSaleAsPercentage = 0;
    let collectionSaleAsPercentage = 0;

    const computeSale = (sales: Sale[], price: number, qty: number): void => {
      sales.forEach((sale) => {
        if (
          !moment(sale.expiredDate).isAfter(moment.utc()) ||
          !moment(sale.startedDate).isBefore(moment.utc())
        ) {
          return;
        }

        switch (sale.unit) {
          case SaleUnit.USD:
            totalSaleAsCurrency += sale.saleOff * qty;
            break;
          case SaleUnit.PERCENTAGE:
            let salePrice = sale.saleOff;
            switch (sale.saleType) {
              case SaleType.PRODUCT:
                if (productSaleAsPercentage < salePrice / 100) {
                  productSaleAsPercentage = salePrice / 100;
                }
                break;
              case SaleType.COLLECTION:
                if (collectionSaleAsPercentage < salePrice / 100) {
                  collectionSaleAsPercentage = salePrice / 100;
                }
                break;
            }

            break;
        }
      });
    };

    const productSales = this?.sales;
    if (productSales) {
      computeSale(productSales, this.price, 1);
    }

    const collections = this?.collections;
    if (collections) {
      collections.forEach(({ sales }) => {
        if (sales) {
          computeSale(sales, this.price, 1);
        }
      });
    }

    totalSaleAsPercentage =
      collectionSaleAsPercentage + productSaleAsPercentage;

    return {
      totalPrice: this.price,
      totalSaleOffAsCurrency: totalSaleAsCurrency,
      totalSaleOffAsPercentage: totalSaleAsPercentage,
      calculatedPrice:
        this.price - totalSaleAsCurrency - this.price * totalSaleAsPercentage,
    };
  };

  priceInfo: CalculatePriceInfo;

  @BeforeUpdate()
  quantityValidation() {
    if (this.quantity < 0) {
      throw new NotAcceptableException(`Not enough '${this.name}' amount`);
    }
  }
}
