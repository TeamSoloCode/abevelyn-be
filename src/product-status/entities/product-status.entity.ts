import { IsUUID } from 'class-validator';
import { Product } from 'src/products/entities/product.entity';
import { RootEntity } from 'src/common/root-entity.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ProductStatus extends RootEntity {
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
}
