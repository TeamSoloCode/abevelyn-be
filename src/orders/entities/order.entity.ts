import { IsUUID } from 'class-validator';
import { CartItem } from 'src/cart-item/entities/cart-item.entity';
import { Cart } from 'src/carts/entities/cart.entity';
import { OrderStatus } from 'src/common/entity-enum';
import { RootEntity } from 'src/common/root-entity.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
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

  @Column('text')
  cancelReason: string;

  @Column('text')
  rejectReason: string;

  @Column('enum', { enum: OrderStatus })
  orderStatus: OrderStatus;

  @OneToMany(() => CartItem, (cartItem) => cartItem.order, { eager: true })
  cartItems: CartItem[];

  @ManyToOne(() => User, (user) => user.orders)
  owner: User;
}
