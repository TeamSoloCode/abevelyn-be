import { Module } from '@nestjs/common';
import { OrderHistoryService } from './order-history.service';
import { OrderHistoryController } from './order-history.controller';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderHistoryRepository } from './repositories/order-history.repository';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([OrderHistoryRepository])],
  controllers: [OrderHistoryController],
  providers: [OrderHistoryService],
})
export class OrderHistoryModule {}
