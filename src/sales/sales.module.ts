import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SaleRepository } from './repositories/sale.repository';
import { CollectionRepository } from '../collections/repositories/collection.repository';
import { ProductRepository } from '../products/repositories/product.repository';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      SaleRepository,
      CollectionRepository,
      ProductRepository,
    ]),
  ],
  controllers: [SalesController],
  providers: [SalesService],
})
export class SalesModule {}
