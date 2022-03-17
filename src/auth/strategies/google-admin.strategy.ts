import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IConfig } from '../../config/configuration';
import { ENV_PATH_NAME } from '../../utils';

@Injectable()
export class GoogleAdminStrategy extends PassportStrategy(
  Strategy,
  'google-admin',
) {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get<IConfig>(ENV_PATH_NAME).Google.ClientID,
      clientSecret: configService.get<IConfig>(ENV_PATH_NAME).Google.Secret,
      callbackURL: `${configService.get<IConfig>(ENV_PATH_NAME).Client.Domain}${
        configService.get<IConfig>(ENV_PATH_NAME).Google.CallbackAdminURL
      }`,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos } = profile;
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      accessToken,
    };
    done(null, user);
  }
}
