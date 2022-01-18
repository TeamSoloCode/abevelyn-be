import { Exclude, Expose } from 'class-transformer';
import { IsUUID } from 'class-validator';
import { CartItem } from 'src/cart-item/entities/cart-item.entity';
import { SaleType, SaleUnit } from 'src/common/entity-enum';
import { RootEntity } from 'src/common/root-entity.entity';
import { Order } from 'src/orders/entities/order.entity';
import { Product } from 'src/products/entities/product.entity';
import { Sale } from 'src/sales/entities/sale.entity';
import { User } from 'src/users/entities/user.entity';
import { CalculatePriceInfo } from 'src/utils';
import { Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import * as moment from 'moment';

@Entity()
export class Cart extends RootEntity {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  uuid: string;

  @ManyToOne(() => User, (owner) => owner.carts)
  owner: User;

  @OneToMany(() => CartItem, (item) => item.cart, {
    onDelete: 'NO ACTION',
    eager: true,
  })
  cartItems: CartItem[];

  @Exclude()
  addCartItem = (cartItem: CartItem) => {
    const isExists = this.cartItems.find((i) => i.uuid === cartItem.uuid);
    !isExists && this.cartItems.push(cartItem);
  };

  @Exclude()
  removeCartItem = (cartItem: CartItem) => {
    this.cartItems = this.cartItems.filter((i) => i.uuid !== cartItem.uuid);
  };

  getCartPrice = (orderSales: Sale[] = []): number => {
    let totalPrice = 0;
    this.cartItems.forEach((item) => {
      if (item.isSelected) {
        totalPrice += item.getCartItemPrice
          ? item.getCartItemPrice()
          : item.price;
      }
    });

    return totalPrice;
  };
}
