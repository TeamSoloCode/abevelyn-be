import { IsUUID } from 'class-validator';
import { Cart } from 'src/carts/entities/cart.entity';
import { RootEntity } from 'src/common/root-entity.entity';
import { Order } from 'src/orders/entities/order.entity';
import { Product } from 'src/products/entities/product.entity';
import { User } from 'src/users/entities/user.entity';
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
}
