import { Exclude } from 'class-transformer';
import { IsUUID } from 'class-validator';
import { round } from 'lodash';
import { CartItem } from 'src/cart-item/entities/cart-item.entity';
import { OrderStatus, SaleUnit } from 'src/common/entity-enum';
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
  constructor(cartItems: CartItem[], owner: User, orderSale?: Sale) {
    super();

    this.cartItems = cartItems;
    this.owner = owner;
    this.sale = orderSale;
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

  sale?: Sale;

  priceInfo = (): CalculatePriceInfo => {
    let totalPrice = 0;

    (this.cartItems || []).forEach((item) => {
      if (item.isSelected || this.status) {
        totalPrice += item.price;
      }
    });

    let calculatedPrice = totalPrice;

    if (this.sale && this.sale.applyPrice <= totalPrice) {
      switch (this.sale.unit) {
        case SaleUnit.PERCENTAGE:
          const saleOff = totalPrice * (this.sale.saleOff / 100);
          calculatedPrice =
            calculatedPrice -
            (saleOff > (this.sale.maxOff || saleOff)
              ? this.sale.maxOff
              : round(saleOff, 2));
          break;
        case SaleUnit.USD:
          calculatedPrice = calculatedPrice - this.sale.saleOff;
          break;
      }
    }

    return {
      totalPrice: totalPrice,
      calculatedPrice,
      totalSaleOffAsCurrency: round(totalPrice - calculatedPrice, 2),
      totalSaleOffAsPercentage: round(
        (totalPrice - calculatedPrice) / totalPrice,
        2,
      ),
    };
  };
}
