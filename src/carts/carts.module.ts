import { Module } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CartsController } from './carts.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartRepository } from './repositories/cart.repository';
import { UserRepository } from 'src/users/repositories/user.repository';
import { CartItemRepository } from 'src/cart-item/repositories/cart-item.repository';
import { ProductRepository } from 'src/products/repositories/product.repository';
import { CartItemModule } from 'src/cart-item/cart-item.module';

@Module({
  imports: [
    AuthModule,
    CartItemModule,
    TypeOrmModule.forFeature([
      CartRepository,
      UserRepository,
      CartItemRepository,
      ProductRepository,
    ]),
  ],
  controllers: [CartsController],
  providers: [CartsService],
})
export class CartsModule {}
