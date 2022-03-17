import { IsUUID } from 'class-validator';
import { RootEntity } from '../../common/root-entity.entity';
import { Product } from '../../products/entities/product.entity';
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Material extends RootEntity {
  constructor(name: string) {
    super();
    this.name = name;
  }

  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  uuid: string;

  @Column('varchar', { length: 256 })
  name: string;

  @Column('varchar', { nullable: true })
  nameInFrench: string;

  @Column('varchar', { nullable: true })
  nameInVietnames: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('text', { nullable: true })
  descriptionInFrench: string;

  @Column('text', { nullable: true })
  descriptionInVietnames: string;

  @ManyToMany(() => Product, (prod) => prod.materials)
  products: Product[];
}
