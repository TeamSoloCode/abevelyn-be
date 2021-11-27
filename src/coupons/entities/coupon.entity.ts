import { IsUUID } from 'class-validator';
import { Collection } from 'src/collections/entities/collection.entity';
import { RootEntity } from 'src/common/root-entity.entity';
import { Product } from 'src/products/entities/product.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Coupon extends RootEntity {
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
}
