import { IsUUID } from 'class-validator';
import { Coupon } from 'src/coupons/entities/coupon.entity';
import { ProductColection } from 'src/products/entities/product_collection.entity';
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

@Entity()
export class Collection extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  uuid: string;

  @Column('varchar', { length: 256 })
  name: string;

  @Column('varchar', { length: 256, name: 'nameFr' })
  nameInFrench: string;

  @Column('varchar', { length: 256, name: 'nameVn' })
  nameInVietnames: string;

  @Column('text')
  description: string;

  @Column('text', { name: 'descriptionFr' })
  descriptionInFrench: string;

  @Column('text', { name: 'descriptionVn' })
  descriptionInVietnames: string;

  @OneToOne((type) => Coupon, { nullable: true })
  @JoinColumn({ name: 'couponUuid' })
  coupon: Coupon;

  @OneToMany(
    (type) => ProductColection,
    (productCollection) => productCollection.collection,
  )
  productCollection: ProductColection;

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
