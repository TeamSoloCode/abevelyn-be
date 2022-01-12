import { Module } from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { AddressesController } from './addresses.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressRepository } from './repositories/address.repository';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([AddressRepository])],
  controllers: [AddressesController],
  providers: [AddressesService],
})
export class AddressesModule {}
