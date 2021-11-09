import { IsUUID } from 'class-validator';
import { Color } from 'src/colors/entities/color.entity';
import { Product } from 'src/products/entities/product.entity';
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
export class Review extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  uuid: string;

  @ManyToOne(() => User, (review) => review.reviews)
  owner: User;

  @ManyToOne(() => Product, (product) => product.reviews)
  product: Product;

  @ManyToOne(() => Review, (review) => review.parentReview, { nullable: true })
  parentReview: Review;

  @Column('varchar', { length: 512 })
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
