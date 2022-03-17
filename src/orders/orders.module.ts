import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderRepository } from './repositories/order.repository';
import { CartItemRepository } from '../cart-item/repositories/cart-item.repository';
import { SaleRepository } from '../sales/repositories/sale.repository';
import { UserProfileRepository } from '../user-profile/repositories/user-profile.respository';
import { CartRepository } from '../carts/repositories/cart.repository';
import { ProductRepository } from '../products/repositories/product.repository';
import { OrderHistoryRepository } from '../order-history/repositories/order-history.repository';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      OrderRepository,
      CartItemRepository,
      SaleRepository,
      UserProfileRepository,
      CartRepository,
      ProductRepository,
      OrderHistoryRepository,
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
