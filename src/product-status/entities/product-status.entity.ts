import { IsUUID } from 'class-validator';
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
import { CreateProductStatusDto } from '../dto/create-product-status.dto';

@Entity()
export class ProductStatus extends BaseEntity {
  constructor(name: string) {
    super();
    this.name = name;
  }

  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  uuid: string;

  @Column('varchar', { length: 256, unique: true })
  name: string;

  @Column('varchar', { length: 256, nullable: true })
  nameInFrench?: string;

  @Column('varchar', { length: 256, nullable: true })
  nameInVietnames?: string;

  @Column('text', { nullable: true })
  description?: string;

  @Column('text', { nullable: true })
  descriptionInFrench: string;

  @Column('text', { nullable: true })
  descriptionInVietnames: string;

  @OneToMany(() => Product, (product) => product.productStatus)
  product: Product[];

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
