import { IsUUID } from 'class-validator';
import { RootEntity } from 'src/common/root-entity.entity';
import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ProductHistory extends RootEntity {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  uuid: string;
}
