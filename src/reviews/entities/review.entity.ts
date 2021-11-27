import { IsUUID } from 'class-validator';
import { Color } from 'src/colors/entities/color.entity';
import { RootEntity } from 'src/common/root-entity.entity';
import { Product } from 'src/products/entities/product.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Review extends RootEntity {
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
}
