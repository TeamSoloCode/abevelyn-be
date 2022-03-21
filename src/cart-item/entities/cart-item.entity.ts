import { ForbiddenException } from '@nestjs/common';
import { IsUUID } from 'class-validator';
import { Cart } from '../../carts/entities/cart.entity';
import { RootEntity } from '../../common/root-entity.entity';
import { Order } from '../../orders/entities/order.entity';
import { Product } from '../../products/entities/product.entity';
import { User } from '../../users/entities/user.entity';
import { CalculatePriceInfo } from '../../utils';
import {
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class CartItem extends RootEntity {
  constructor(cart: Cart, product: Product, owner: User) {
    super();

    this.owner = owner;
    this.cart = cart;
    this.product = product;
  }

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
  isSelected: boolean;

  @Column('int', { default: 1 })
  quantity: number;

  @ManyToOne(() => Product, (product) => product.cartItems, {
    nullable: false,
    eager: true,
  })
  product: Product;

  @ManyToOne(() => Cart, (cart) => cart.cartItems)
  cart: Cart;

  @ManyToOne(() => Order, (order) => order.cartItems)
  order: Order;

  @ManyToOne(() => User, (user) => user.carts)
  owner: User;

  @BeforeUpdate()
  update() {
    if (this.product.quantity < this.quantity) {
      throw new ForbiddenException(
        `Cannot order more than ${this.product.quantity}`,
      );
    }

    if (this.quantity <= 0) {
      throw new ForbiddenException(
        'Cannot update item quantity to less than or equal 0',
      );
    }
  }

  priceInfo = (): CalculatePriceInfo => {
    if (!this.product) return null;
    return {
      calculatedPrice: this.product.getPrice
        ? this.product.getPrice().calculatedPrice * this.quantity
        : this.product.priceInfo.calculatedPrice * this.quantity,
    };
  };
}
