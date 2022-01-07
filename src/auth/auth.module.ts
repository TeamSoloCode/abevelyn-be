import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from 'src/users/repositories/user.repository';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersService } from 'src/users/users.service';
import { UserProfileService } from 'src/user-profile/user-profile.service';
import { UserProfileRepository } from 'src/user-profile/repositories/user-profile.respository';

@Module({
  imports: [
    JwtModule.register({
      // TODO: need to put this into enviroment variables
      secret: 'mysecret41',
      signOptions: {
        expiresIn: 3600,
      },
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([UserRepository, UserProfileRepository]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, UsersService, UserProfileService],
  exports: [
    JwtStrategy,
    PassportModule,
    AuthService,
    UsersService,
    UserProfileService,
  ],
})
export class AuthModule {}
