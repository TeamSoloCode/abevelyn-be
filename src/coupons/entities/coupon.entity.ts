import { IsUUID } from 'class-validator';
import { Collection } from 'src/collections/entities/collection.entity';
import { Product } from 'src/products/entities/product.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Coupon extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  uuid: string;

  @Column()
  code: string;

  @Column('datetime')
  applyDate: Date;

  @Column('datetime')
  expiredDate: Date;

  @OneToMany(() => Product, (product) => product.coupon)
  product: Product[];

  @OneToMany(() => Collection, (collection) => collection.coupon)
  collections: Collection[];

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
