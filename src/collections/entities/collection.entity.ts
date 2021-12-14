import { IsUUID } from 'class-validator';
import { RootEntity } from 'src/root-entity.entity';
import { Coupon } from 'src/coupons/entities/coupon.entity';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from 'src/products/entities/product.entity';

@Entity()
export class Collection extends RootEntity {
  constructor(name: string, available: boolean = true) {
    super();

    this.name = name;
    this.available = available;
  }

  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  uuid: string;

  @Column('varchar', { length: 256, unique: true })
  name: string;

  @Column('varchar', {
    length: 256,
    unique: true,
    nullable: true,
  })
  nameInFrench?: string;

  @Column('varchar', {
    length: 256,
    unique: true,
    nullable: true,
  })
  nameInVietnames?: string;

  @Column('text', { nullable: true })
  description?: string;

  @Column('text', { nullable: true })
  descriptionInFrench?: string;

  @Column('text', {
    nullable: true,
  })
  descriptionInVietnames?: string;

  @ManyToOne((type) => Coupon, (coupon) => coupon.collections, {
    nullable: true,
  })
  coupon?: Coupon;

  @ManyToMany((type) => Product, (prod) => prod.collections)
  products: Product[];
}
