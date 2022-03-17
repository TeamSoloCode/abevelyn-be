import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductRepository } from './repositories/product.repository';
import { AuthModule } from '../auth/auth.module';
import { CollectionRepository } from '../collections/repositories/collection.repository';
import { ColorRepository } from '../colors/repositories/color.repository';
import { SizeRepository } from '../sizes/repositories/size.repository';
import { ProductStatusRepository } from '../product-status/repositories/product-status.repository';
import { MaterialRepository } from '../materials/repositories/material.reponsitory';
import { SaleRepository } from '../sales/repositories/sale.repository';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      ProductRepository,
      CollectionRepository,
      ColorRepository,
      SizeRepository,
      ProductStatusRepository,
      MaterialRepository,
      SaleRepository,
    ]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
