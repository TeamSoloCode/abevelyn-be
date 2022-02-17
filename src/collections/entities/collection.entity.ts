import { IsUUID } from 'class-validator';
import { RootEntity } from 'src/common/root-entity.entity';
import { Coupon } from 'src/coupons/entities/coupon.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from 'src/products/entities/product.entity';
import { Sale } from 'src/sales/entities/sale.entity';

@Entity('collection')
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

  @Column('text', {
    nullable: true,
  })
  image?: string;

  @ManyToOne((type) => Coupon, (coupon) => coupon.collections, {
    nullable: true,
  })
  coupon?: Coupon;

  @ManyToMany((type) => Product, (prod) => prod.collections)
  products: Product[];

  @ManyToMany(() => Sale, (sale) => sale.collections, { eager: true })
  sales: Sale[];
}
