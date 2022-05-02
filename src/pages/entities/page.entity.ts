import { IsUUID } from 'class-validator';
import { RootEntity } from 'src/common/root-entity.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Page extends RootEntity {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  uuid: string;

  @Column('json')
  layout: string;

  @Column('json')
  layoutMin: string;

  @Column('text')
  code: string;

  @Column('text')
  codeMin: string;
}
