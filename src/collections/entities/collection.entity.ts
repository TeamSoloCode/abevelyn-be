import { IsUUID } from 'class-validator';
import { ProductColection } from 'src/products/entities/product_collection.entity';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Collection extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  uuid: string;

  @Column('varchar', { length: 256 })
  name: string;

  @Column('text')
  description: string;

  @OneToMany(
    (type) => ProductColection,
    (productCollection) => productCollection.collection,
  )
  productCollection: ProductColection;
}
