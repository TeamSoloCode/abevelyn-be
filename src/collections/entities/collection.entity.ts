import { IsUUID } from 'class-validator';
import { RootEntity } from 'src/common/root-entity.entity';
import { Coupon } from 'src/coupons/entities/coupon.entity';
import { ProductColection } from 'src/products/entities/product_collection.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

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

  @OneToMany(
    (type) => ProductColection,
    (productCollection) => productCollection.collection,
  )
  productCollection: ProductColection[];
}
