import { Module } from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { CollectionsController } from './collections.controller';
import { AuthService } from 'src/auth/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from 'src/users/repositories/user.repository';
import { AuthModule } from 'src/auth/auth.module';
import { CollectionRepository } from './repositories/collection.repository';
import { SaleRepository } from 'src/sales/repositories/sale.repository';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([CollectionRepository, SaleRepository]),
  ],
  controllers: [CollectionsController],
  providers: [CollectionsService],
})
export class CollectionsModule {}
