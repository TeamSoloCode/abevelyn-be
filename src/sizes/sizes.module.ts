import { Module } from '@nestjs/common';
import { SizesService } from './sizes.service';
import { SizesController } from './sizes.controller';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SizeRepository } from './repositories/size.repository';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([SizeRepository])],
  controllers: [SizesController],
  providers: [SizesService],
})
export class SizesModule {}
