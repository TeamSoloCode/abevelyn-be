import { Exclude } from 'class-transformer';
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
import moment from 'moment';

@Entity()
export class Cart extends RootEntity {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  uuid: string;

  @ManyToOne(() => User, (owner) => owner.carts)
  owner: User;

  @OneToMany(() => CartItem, (item) => item.cart, {
    onDelete: 'CASCADE',
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

  getCartPrice = (orderSales: Sale[] = []): CalculatePriceInfo => {
    let totalPrice = 0;
    let totalSaleAsCurrency = 0;
    let totalSaleAsPercentage = 0;

    let productSaleAsPercentage = 0;
    let collectionSaleAsPercentage = 0;
    let orderSaleAsPercentage = 0;

    const computeSale = (sales: Sale[], price: number, qty: number): void => {
      sales.forEach((sale) => {
        if (
          moment(sale.expiredDate).isBefore(moment.utc()) &&
          moment(sale.startedDate).isAfter(moment.utc())
        ) {
          return;
        }

        switch (sale.unit) {
          case SaleUnit.USD:
            totalSaleAsCurrency += sale.saleOff * qty;
            break;
          case SaleUnit.PERCENTAGE:
            productSaleAsPercentage = sale.saleOff / 100;
            break;
        }
      });
    };

    this.cartItems.forEach((item) => {
      if (item.product && item.isSelected) {
        const product = item.product;
        totalPrice += product.price * item.quantity;

        const productSales = item.product?.sales;
        if (productSales) {
          computeSale(productSales, product.price, item.quantity);
        }

        const collections = item.product?.collections;
        collections.forEach(({ sales }) => {
          if (sales) {
            computeSale(sales, product.price, item.quantity);
          }
        });
      }
    });

    // let maxOrderSale = 0
    // const selectedOrderSale = orderSales.find((sale) => {
    //   return
    // })

    totalSaleAsPercentage =
      collectionSaleAsPercentage + productSaleAsPercentage;

    const priceExcludeOrderSale =
      totalPrice - totalSaleAsCurrency - totalPrice * totalSaleAsPercentage;

    return {
      totalPrice,
      totalSaleOffAsCurrency: totalSaleAsCurrency,
      totalSaleOffAsPercentage: totalSaleAsPercentage,
      calculatedPrice: priceExcludeOrderSale,
    };
  };
}
