import { IsUUID } from 'class-validator';
import { CartItem } from 'src/cart-item/entities/cart-item.entity';
import { Cart } from 'src/carts/entities/cart.entity';
import { RootEntity } from 'src/common/root-entity.entity';
import { OrderStatus } from 'src/order-status/entities/order-status.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('order')
export class Order extends RootEntity {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  uuid: string;

  @ManyToOne(() => OrderStatus, (status) => status.orders, { eager: true })
  status: OrderStatus;

  @OneToMany(() => CartItem, (cartItem) => cartItem.order, { eager: true })
  cartItems: CartItem[];

  @ManyToOne(() => User, (user) => user.orders)
  owner: User;
}
