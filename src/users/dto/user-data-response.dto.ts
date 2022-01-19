import { classToPlain, Exclude, Expose } from 'class-transformer';
import CommonDataResponse from 'src/common/common-data-response.dto';
import { LanguageCode, SignInType, UserRoles } from 'src/common/entity-enum';
import { User } from '../entities/user.entity';

export class UserDataResponse extends CommonDataResponse<
  Partial<UserDataResponse>
> {
  uuid: string;

  @Exclude()
  token: string;

  @Exclude()
  refreshToken: string;

  @Exclude()
  password: string;

  _signupType: SignInType;
  @Expose({ name: 'signupType' })
  get signupType(): SignInType {
    return this._signupType;
  }

  _username: string;
  @Expose({ name: 'username' })
  public get username(): string {
    return this._username;
  }

  _role: UserRoles;
  @Expose({ name: 'role' })
  public get role(): UserRoles {
    return this._role;
  }

  _email: string;
  @Expose({ name: 'email' })
  public get email(): string {
    return this._email;
  }

  @Exclude()
  salt: string;

  public create(
    data: UserDataResponse,
    language: LanguageCode,
    locale: string,
    dataResponseRole: UserRoles,
  ): Partial<UserDataResponse> {
    const obj: UserDataResponse = Object.create(UserDataResponse.prototype);

    obj._language = language;

    return this.serializeDataResponse(
      obj,
      data,
      language,
      locale,
      dataResponseRole,
    );
  }
}
