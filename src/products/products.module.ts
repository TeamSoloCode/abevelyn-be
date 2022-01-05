import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductRepository } from './repositories/product.repository';
import { AuthModule } from 'src/auth/auth.module';
import { CollectionRepository } from 'src/collections/repositories/collection.repository';
import { ColorRepository } from 'src/colors/repositories/color.repository';
import { SizeRepository } from 'src/sizes/repositories/size.repository';
import { ProductStatusRepository } from 'src/product-status/repositories/product-status.repository';
import { MaterialRepository } from 'src/materials/repositories/material.reponsitory';
import { SaleRepository } from 'src/sales/repositories/sale.repository';

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
