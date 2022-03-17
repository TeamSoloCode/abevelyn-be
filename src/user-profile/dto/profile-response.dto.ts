import { Expose } from 'class-transformer';
import CommonDataResponse from '../../common/common-data-response.dto';
import { LanguageCode, UserRoles } from '../../common/entity-enum';
import { UserDataResponse } from '../../users/dto/user-data-response.dto';

export class UserProfileResponseDTO extends CommonDataResponse<
  Partial<UserProfileResponseDTO>
> {
  firstName: string;

  lastName: string;

  @Expose({ name: 'displayName', toPlainOnly: true })
  getDisplayName() {
    return this.firstName + ' ' + this.lastName;
  }

  picture: string;

  @Reflect.metadata(CommonDataResponse.DTO_KEY, 'user')
  owner: UserDataResponse;

  // addresses: Address[]; TODO

  create(
    data: UserProfileResponseDTO,
    language: LanguageCode = LanguageCode.ENGLISH,
    locale: string,
    dataResponseRole: UserRoles,
  ) {
    const obj: UserProfileResponseDTO = Object.create(
      UserProfileResponseDTO.prototype,
    );

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
