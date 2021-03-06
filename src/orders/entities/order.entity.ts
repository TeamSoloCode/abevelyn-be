import { Exclude } from 'class-transformer';
import { IsUUID } from 'class-validator';
import { round } from 'lodash';
import { CartItem } from '../../cart-item/entities/cart-item.entity';
import { OrderStatus, SaleUnit } from '../../common/entity-enum';
import { RootEntity } from '../../common/root-entity.entity';
import { OrderHistory } from '../../order-history/entities/order-history.entity';
import { Sale } from '../../sales/entities/sale.entity';
import { User } from '../../users/entities/user.entity';
import { CalculatePriceInfo } from '../../utils';
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

  @OneToOne((type) => OrderHistory, (orderHist) => orderHist.order)
  @JoinColumn()
  orderHist: OrderHistory;

  @ManyToOne(() => User, (user) => user.orders)
  owner: User;

  @ManyToOne(() => Sale, (sale) => sale.orders, { nullable: true })
  sale?: Sale;

  getOrderHist = () => {
    return this.orderHist?.orderHist;
  };

  priceInfo = (): CalculatePriceInfo => {
    let totalPrice = 0;

    (this.cartItems || []).forEach((item) => {
      if (item.isSelected || this.status) {
        totalPrice +=
          (<CalculatePriceInfo>item.priceInfo).calculatedPrice ??
          item.priceInfo().calculatedPrice;
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
