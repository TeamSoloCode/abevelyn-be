import { IsUUID } from 'class-validator';
import { CartItem } from 'src/cart-item/entities/cart-item.entity';
import { RootEntity } from 'src/common/root-entity.entity';
import { Product } from 'src/products/entities/product.entity';
import { User } from 'src/users/entities/user.entity';
import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Cart extends RootEntity {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  uuid: string;

  @ManyToOne(() => User, (owner) => owner.carts)
  owner: User;

  @OneToMany(() => CartItem, (item) => item.cart, {
    onDelete: 'CASCADE',
  })
  cartItems: CartItem[];
}
