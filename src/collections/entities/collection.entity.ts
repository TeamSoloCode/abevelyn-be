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
import { CreateCollectionDto } from '../dto/create-collection.dto';

@Entity()
export class Collection extends BaseEntity {
  constructor(createCollectionDto: CreateCollectionDto) {
    super();

    this.name = createCollectionDto?.name;
    this.description = createCollectionDto?.description;
    this.available = createCollectionDto?.available;
  }

  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  uuid: string;

  @Column('varchar', { length: 256, unique: true })
  name: string;

  @Column('varchar', {
    length: 256,
    name: 'nameFr',
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

  @Column('text', { nullable: true })
  descriptionInVietnames?: string;

  @Column('bit', { default: true })
  available: boolean = true;

  @Column('bit', { default: false })
  deleted: boolean = false;

  @OneToOne((type) => Coupon, { nullable: true })
  @JoinColumn({ name: 'couponUuid' })
  coupon?: Coupon;

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
