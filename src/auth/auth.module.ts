import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '../users/repositories/user.repository';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersService } from '../users/users.service';
import { UserProfileService } from '../user-profile/user-profile.service';
import { UserProfileRepository } from '../user-profile/repositories/user-profile.respository';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IConfig } from '../config/configuration';
import { ENV_PATH_NAME } from '../utils';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get<IConfig>(ENV_PATH_NAME).JWT.Secret,
          signOptions: {
            expiresIn:
              configService.get<IConfig>(ENV_PATH_NAME).JWT.TokenExpiredTime,
          },
        };
      },
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([UserRepository, UserProfileRepository]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    UsersService,
    UserProfileService,
    ConfigService,
  ],
  exports: [
    JwtStrategy,
    PassportModule,
    AuthService,
    UsersService,
    UserProfileService,
  ],
})
export class AuthModule {}
