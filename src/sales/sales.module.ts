import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SaleRepository } from './repositories/sale.repository';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([SaleRepository])],
  controllers: [SalesController],
  providers: [SalesService],
})
export class SalesModule {}
