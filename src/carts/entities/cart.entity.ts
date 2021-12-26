import { IsUUID } from 'class-validator';
import { CartItem } from 'src/cart-item/entities/cart-item.entity';
import { RootEntity } from 'src/common/root-entity.entity';
import { Order } from 'src/orders/entities/order.entity';
import { Product } from 'src/products/entities/product.entity';
import { User } from 'src/users/entities/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Cart extends RootEntity {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  uuid: string;

  @Column('bit', {
    default: false,
    transformer: {
      from: (v: Buffer) => {
        if (v instanceof Buffer) {
          return !!v?.readInt8(0);
        }
      },
      to: (v) => v,
    },
  })
  isPaid: boolean;

  @ManyToOne(() => User, (owner) => owner.carts)
  owner: User;

  @OneToOne(() => Order, (order) => order.cart)
  order: Order;

  @OneToMany(() => CartItem, (item) => item.cart, {
    onDelete: 'CASCADE',
    eager: true,
  })
  cartItems: CartItem[];

  addCartItem = (cartItem: CartItem) => {
    const isExists = this.cartItems.find((i) => i.uuid === cartItem.uuid);
    !isExists && this.cartItems.push(cartItem);
  };

  removeCartItem = (cartItem: CartItem) => {
    const newCartItems = [];
    this.cartItems.forEach((i) => {
      if (i.uuid !== cartItem.uuid) {
        newCartItems.push(i);
      }
    });

    this.cartItems = newCartItems;
  };
}
