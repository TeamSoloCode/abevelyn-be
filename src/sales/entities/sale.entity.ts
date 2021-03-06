import { IsUUID } from 'class-validator';
import * as moment from 'moment';
import { Collection } from '../../collections/entities/collection.entity';
import { SaleType, SaleUnit } from '../../common/entity-enum';
import { RootEntity } from '../../common/root-entity.entity';
import { Order } from '../../orders/entities/order.entity';
import { Product } from '../../products/entities/product.entity';
import {
  AfterLoad,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Sale extends RootEntity {
  constructor(
    saleOff: number,
    startedDate: Date,
    expiredDate: Date,
    saleType: SaleType,
  ) {
    super();
    this.saleType = saleType;
    this.saleOff = saleOff;
    this.startedDate = startedDate;
    this.expiredDate = expiredDate;
  }

  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  uuid: string;

  @Column('varchar', { length: 256, unique: true })
  name: string;

  @Column('varchar', { length: 256, nullable: true, unique: true })
  nameInFrench?: string;

  @Column('varchar', { length: 256, nullable: true, unique: true })
  nameInVietnamese?: string;

  @Column('text', { nullable: true })
  description?: string;

  @Column('text', { nullable: true })
  descriptionInFrench?: string;

  @Column('text', { nullable: true })
  descriptionInVietnamese?: string;

  @Column('double')
  saleOff: number;

  @Column('enum', { enum: SaleUnit, default: SaleUnit.PERCENTAGE })
  unit: SaleUnit;

  @Column('double', { nullable: true })
  applyPrice: number;

  @Column('double', { nullable: true })
  maxOff: number;

  @Column('datetime')
  startedDate: Date;

  @Column('datetime')
  expiredDate: Date;

  @Column('enum', { enum: SaleType })
  saleType: SaleType;

  @ManyToMany(() => Product, (prod) => prod.sales)
  @JoinTable()
  products: Product[];

  @ManyToMany(() => Collection, (col) => col.sales)
  @JoinTable()
  collections: Collection[];

  @OneToMany(() => Order, (order) => order.sale)
  orders: Order[];

  @AfterLoad()
  isEditable = (): boolean => {
    return moment(this.startedDate).isAfter(moment.utc());
  };
}
