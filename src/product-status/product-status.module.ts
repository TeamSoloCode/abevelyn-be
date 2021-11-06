import { Module } from '@nestjs/common';
import { ProductStatusService } from './product-status.service';
import { ProductStatusController } from './product-status.controller';

@Module({
  controllers: [ProductStatusController],
  providers: [ProductStatusService]
})
export class ProductStatusModule {}
