import { classToPlain, Exclude } from 'class-transformer';
import CommonDataResponse from 'src/common/common-data-response.dto';
import { LanguageCode, SignInType, UserRoles } from 'src/common/entity-enum';
import { User } from '../entities/user.entity';

export class UserDataResponse extends CommonDataResponse<
  Partial<UserDataResponse>
> {
  constructor() {
    super();
  }

  uuid: string;

  @Exclude()
  token: string;

  @Exclude()
  refreshToken: string;

  username: string;

  email: string;

  @Exclude()
  password: string;

  signupType: SignInType;

  role: UserRoles;

  @Exclude()
  salt: string;

  public create(
    data: UserDataResponse,
    language: LanguageCode,
    locale: string,
    dataResponseRole: UserRoles,
  ): Partial<UserDataResponse> {
    const obj: UserDataResponse = Object.create(UserDataResponse.prototype);

    Object.assign(obj, classToPlain(data));
    obj._language = language;

    return classToPlain(obj, {
      excludePrefixes: ['_'],
      groups: [dataResponseRole],
    });
  }
}
