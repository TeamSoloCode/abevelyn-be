import { IsUUID } from 'class-validator';
import { Cart } from 'src/carts/entities/cart.entity';
import { RootEntity } from 'src/common/root-entity.entity';
import { Product } from 'src/products/entities/product.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CartItem extends RootEntity {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  uuid: string;

  @ManyToOne(() => Product, (product) => product.cartItems)
  product: Product;

  @Column('int', { default: 1 })
  quantity: number;

  @ManyToOne(() => Cart, (cart) => cart.cartItems)
  cart: Cart;
}
