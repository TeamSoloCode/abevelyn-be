import { Module } from '@nestjs/common';
import { ProductStatusService } from './product-status.service';
import { ProductStatusController } from './product-status.controller';
import { AuthModule } from '../auth/auth.module';
import { ProductStatusRepository } from './repositories/product-status.repository';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([ProductStatusRepository])],
  controllers: [ProductStatusController],
  providers: [ProductStatusService],
})
export class ProductStatusModule {}
