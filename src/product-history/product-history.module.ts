import { Module } from '@nestjs/common';
import { ProductHistoryService } from './product-history.service';
import { ProductHistoryController } from './product-history.controller';

@Module({
  controllers: [ProductHistoryController],
  providers: [ProductHistoryService]
})
export class ProductHistoryModule {}
