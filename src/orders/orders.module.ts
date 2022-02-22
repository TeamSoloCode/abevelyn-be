import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderRepository } from './repositories/order.repository';
import { CartItemRepository } from 'src/cart-item/repositories/cart-item.repository';
import { SaleRepository } from 'src/sales/repositories/sale.repository';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      OrderRepository,
      CartItemRepository,
      SaleRepository,
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
