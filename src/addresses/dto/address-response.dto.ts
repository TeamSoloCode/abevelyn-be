import { Expose } from 'class-transformer';
import CommonDataResponse from 'src/common/common-data-response.dto';
import { LanguageCode, UserRoles } from 'src/common/entity-enum';
import { UserDataResponse } from 'src/users/dto/user-data-response.dto';

export class AddressResponseDTO extends CommonDataResponse<
  Partial<AddressResponseDTO>
> {
  @Expose({ groups: [UserRoles.ADMIN] })
  updatedDate: Date;

  @Reflect.metadata(CommonDataResponse.DTO_KEY, 'user')
  owner: UserDataResponse;

  public create(
    data: any,
    language: LanguageCode,
    locale: string,
    dataResponseRole: UserRoles,
  ): Partial<AddressResponseDTO> {
    const obj: AddressResponseDTO = Object.create(AddressResponseDTO.prototype);

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
