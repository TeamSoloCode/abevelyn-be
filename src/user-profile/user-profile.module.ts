import { Module } from '@nestjs/common';
import { UserProfileService } from './user-profile.service';
import { UserProfileController } from './user-profile.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProfileRepository } from './repositories/user-profile.respository';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([UserProfileRepository])],
  controllers: [UserProfileController],
  providers: [UserProfileService],
  exports: [UserProfileService],
})
export class UserProfileModule {}
