import { IsUUID } from 'class-validator';
import { RootEntity } from 'src/root-entity.entity';
import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserProfile extends RootEntity {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  uuid: string;
}
