import { IsUUID, Max } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
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
export class Feedback extends BaseEntity {
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
