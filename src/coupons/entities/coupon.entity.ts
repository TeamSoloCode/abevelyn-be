import { IsUUID } from 'class-validator';
import { Collection } from '../../collections/entities/collection.entity';
import { RootEntity } from '../../common/root-entity.entity';
import { Product } from '../../products/entities/product.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Coupon extends RootEntity {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  uuid: string;

  @Column()
  code: string;

  @Column('datetime')
  startedDate: Date;

  @Column('datetime')
  expiredDate: Date;

  @OneToMany(() => Product, (product) => product.coupon)
  product: Product[];

  @OneToMany(() => Collection, (collection) => collection.coupon)
  collections: Collection[];
}
