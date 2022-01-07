import { IsUUID } from 'class-validator';
import { Collection } from 'src/collections/entities/collection.entity';
import { SaleUnit } from 'src/common/entity-enum';
import { RootEntity } from 'src/common/root-entity.entity';
import { Product } from 'src/products/entities/product.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Sale extends RootEntity {
  constructor(saleOff: number, startedDate: Date, expiredDate: Date) {
    super();
    this.saleOff = saleOff;
    this.startedDate = startedDate;
    this.expiredDate = expiredDate;
  }

  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  uuid: string;

  @Column('varchar', { length: 512, nullable: true })
  name: string;

  @Column('varchar', { length: 512, nullable: true })
  nameInFrench?: string;

  @Column('varchar', { length: 512, nullable: true })
  nameInVietnamese?: string;

  @Column('text', { nullable: true })
  description?: string;

  @Column('text', { nullable: true })
  descriptionInFrench?: string;

  @Column('text', { nullable: true })
  descriptionInVietnamese?: string;

  @Column('double')
  saleOff: number;

  @Column('double', { nullable: true })
  maxOff: number;

  @Column('enum', { enum: SaleUnit, default: SaleUnit.PERCENTAGE })
  unit: SaleUnit;

  @Column('double', { nullable: true })
  applyPrice: number;

  @Column('datetime')
  startedDate: Date;

  @Column('datetime')
  expiredDate: Date;

  @ManyToMany(() => Product, (prod) => prod.sales)
  @JoinTable()
  products: Product[];

  @ManyToMany(() => Collection, (col) => col.sales)
  @JoinTable()
  collections: Collection[];
}
