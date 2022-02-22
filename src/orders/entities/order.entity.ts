import { IsUUID } from 'class-validator';
import { CartItem } from 'src/cart-item/entities/cart-item.entity';
import { OrderStatus } from 'src/common/entity-enum';
import { RootEntity } from 'src/common/root-entity.entity';
import { Sale } from 'src/sales/entities/sale.entity';
import { User } from 'src/users/entities/user.entity';
import { CalculatePriceInfo } from 'src/utils';
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
  constructor(cartItems: CartItem[], owner: User, orderSales: Sale[]) {
    super();

    this.cartItems = cartItems;
    this.owner = owner;
  }

  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  uuid: string;

  @Column('text', { nullable: true })
  cancelReason?: string;

  @Column('text', { nullable: true })
  rejectReason?: string;

  @Column('enum', { enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @OneToMany(() => CartItem, (cartItem) => cartItem.order, { eager: true })
  cartItems: CartItem[];

  @ManyToOne(() => User, (user) => user.orders)
  owner: User;

  orderSales: Sale[];

  totalPrice = (): number => {
    let totalPrice = 0;
    this.cartItems.forEach((item) => {
      if (item.isSelected) {
        totalPrice += item.price;
      }
    });

    return totalPrice;
  };
}
