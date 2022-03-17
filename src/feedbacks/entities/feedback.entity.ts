import { IsUUID, Max } from 'class-validator';
import { RootEntity } from '../../common/root-entity.entity';
import { User } from '../../users/entities/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Feedback extends RootEntity {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  uuid: string;

  @ManyToOne(() => User, (owner) => owner.feedbacks)
  owner: User;

  @Column('varchar', { length: 512 })
  @Max(512)
  message: string;

  @Column('text', { nullable: true })
  image: string;

  @Column('text', { nullable: true })
  image1: string;

  @Column('text', { nullable: true })
  image2: string;
}
