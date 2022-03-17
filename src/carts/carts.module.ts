import { Module } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CartsController } from './carts.controller';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartRepository } from './repositories/cart.repository';
import { UserRepository } from '../users/repositories/user.repository';
import { CartItemRepository } from '../cart-item/repositories/cart-item.repository';
import { ProductRepository } from '../products/repositories/product.repository';
import { CartItemModule } from '../cart-item/cart-item.module';
import { SaleRepository } from '../sales/repositories/sale.repository';

@Module({
  imports: [
    AuthModule,
    CartItemModule,
    TypeOrmModule.forFeature([
      CartRepository,
      UserRepository,
      CartItemRepository,
      ProductRepository,
      SaleRepository,
    ]),
  ],
  controllers: [CartsController],
  providers: [CartsService],
})
export class CartsModule {}
