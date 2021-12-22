import { IsUUID } from 'class-validator';
import { Cart } from 'src/carts/entities/cart.entity';
import { RootEntity } from 'src/common/root-entity.entity';
import { OrderStatus } from 'src/order-status/entities/order-status.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  JoinColumn,
  ManyToOne,
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

  @OneToOne(() => Cart)
  @JoinColumn({ name: 'cartUuid' })
  cart: Cart;

  @ManyToOne(() => User, (user) => user.orders)
  owner: User;
}
