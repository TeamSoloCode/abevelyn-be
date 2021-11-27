import { IsUUID } from 'class-validator';
import { RootEntity } from 'src/root-entity.entity';
import { Product } from 'src/products/entities/product.entity';
import { ProductMaterial } from 'src/products/entities/product_material.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Material extends RootEntity {
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
}
