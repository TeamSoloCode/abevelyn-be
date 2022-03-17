import { Module } from '@nestjs/common';
import { ColorsService } from './colors.service';
import { ColorsController } from './colors.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ColorRepository } from './repositories/color.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([ColorRepository])],
  controllers: [ColorsController],
  providers: [ColorsService],
})
export class ColorsModule {}
