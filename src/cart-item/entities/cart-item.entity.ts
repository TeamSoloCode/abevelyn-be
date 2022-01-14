import { IsUUID } from 'class-validator';
import moment from 'moment';
import { Cart } from 'src/carts/entities/cart.entity';
import { SaleType, SaleUnit } from 'src/common/entity-enum';
import { RootEntity } from 'src/common/root-entity.entity';
import { Order } from 'src/orders/entities/order.entity';
import { Product } from 'src/products/entities/product.entity';
import { Sale } from 'src/sales/entities/sale.entity';
import { User } from 'src/users/entities/user.entity';
import { CalculatePriceInfo } from 'src/utils';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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

  @ManyToOne(() => Product, (product) => product.cartItems, {
    nullable: false,
    eager: true,
  })
  product: Product;

  @Column('int', { default: 1 })
  quantity: number;

  @ManyToOne(() => Cart, (cart) => cart.cartItems)
  cart: Cart;

  @ManyToOne(() => Order, (order) => order.cartItems)
  order: Order;

  @ManyToOne(() => User, (user) => user.carts)
  owner: User;

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

  getCartItemPrice(): CalculatePriceInfo {
    let totalPrice = 0;
    let totalSaleAsCurrency = 0;
    let totalSaleAsPercentage = 0;

    let productSaleAsPercentage = 0;
    let collectionSaleAsPercentage = 0;

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

    if (this.product && this.isSelected) {
      const product = this.product;
      totalPrice += product.price * this.quantity;

      const productSales = this.product?.sales;
      if (productSales) {
        computeSale(productSales, product.price, this.quantity);
      }

      const collections = this.product?.collections;
      collections.forEach(({ sales }) => {
        if (sales) {
          computeSale(sales, product.price, this.quantity);
        }
      });
    }

    totalSaleAsPercentage =
      collectionSaleAsPercentage + productSaleAsPercentage;

    return {
      totalPrice,
      totalSaleOffAsCurrency: totalSaleAsCurrency,
      totalSaleOffAsPercentage: totalSaleAsPercentage,
      calculatedPrice:
        totalPrice - totalSaleAsCurrency - totalPrice * totalSaleAsPercentage,
    };
  }
}
