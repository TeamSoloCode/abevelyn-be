import { IsUUID } from 'class-validator';
import { RootEntity } from 'src/root-entity.entity';
import { Product } from 'src/products/entities/product.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Color extends RootEntity {
  constructor(name: string, code: string) {
    super();
    this.name = name;
    this.code = code;
  }

  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  uuid: string;

  @Column('varchar', { length: 128, unique: true })
  name: string;

  @Column('varchar', { length: 128, nullable: true })
  nameInFrench?: string;

  @Column('varchar', { length: 128, nullable: true })
  nameInVietnames?: string;

  @Column('varchar', { length: 128 })
  code: string;

  @OneToMany(() => Product, (product) => product.color)
  product: Product[];
}
