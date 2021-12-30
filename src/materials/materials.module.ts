import { Module } from '@nestjs/common';
import { MaterialsService } from './materials.service';
import { MaterialsController } from './materials.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaterialRepository } from './repositories/material.reponsitory';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([MaterialRepository])],
  controllers: [MaterialsController],
  providers: [MaterialsService],
})
export class MaterialsModule {}
