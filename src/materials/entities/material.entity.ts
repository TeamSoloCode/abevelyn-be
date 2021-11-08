import { IsUUID } from 'class-validator';
import { Product } from 'src/products/entities/product.entity';
import { ProductMaterial } from 'src/products/entities/product_material.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Material extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  uuid: string;

  @Column('varchar', { length: 256 })
  name: string;

  @Column('varchar', { length: 256 })
  nameInFrench: string;

  @Column('varchar', { length: 256 })
  nameInVietnames: string;

  @Column('text')
  description: string;

  @Column('text', { nullable: true })
  descriptionInFrench: string;

  @Column('text', { nullable: true })
  descriptionInVietnames: string;

  @OneToMany(
    () => ProductMaterial,
    (prodAndMaterial) => prodAndMaterial.material,
  )
  productMaterial: ProductMaterial;

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
