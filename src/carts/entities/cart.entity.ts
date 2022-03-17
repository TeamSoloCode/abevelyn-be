import { Exclude, Expose } from 'class-transformer';
import { IsUUID } from 'class-validator';
import { CartItem } from '../../cart-item/entities/cart-item.entity';
import { RootEntity } from '../../common/root-entity.entity';
import { Sale } from '../../sales/entities/sale.entity';
import { User } from '../../users/entities/user.entity';
import { CalculatePriceInfo } from '../../utils';
import {
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as moment from 'moment';

@Entity()
export class Cart extends RootEntity {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  uuid: string;

  @OneToOne(() => User, (owner) => owner.carts)
  @JoinColumn()
  owner: User;

  @OneToMany(() => CartItem, (item) => item.cart, {
    onDelete: 'NO ACTION',
    eager: true,
  })
  cartItems: CartItem[];

  @Exclude()
  addCartItem = (cartItem: CartItem) => {
    const isExists = (this.cartItems || []).find(
      (i) => i.uuid === cartItem.uuid,
    );
    !isExists && this.cartItems.push(cartItem);
  };

  getCartPrice = (orderSales: Sale[] = []): number => {
    let totalPrice = 0;
    (this.cartItems || []).forEach((item) => {
      if (item.isSelected) {
        totalPrice +=
          (<CalculatePriceInfo>item.priceInfo).calculatedPrice ??
          item.priceInfo().calculatedPrice;
      }
    });

    return totalPrice;
  };
}
