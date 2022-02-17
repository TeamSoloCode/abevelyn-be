import { LanguageCode, UserRoles } from 'src/common/entity-enum';
import CommonDataResponse from 'src/common/common-data-response.dto';
import { Expose } from 'class-transformer';
import { ProductDataResponseDto } from 'src/products/dto/product-data-res.dto';

export class CollectionResponseDto extends CommonDataResponse<
  Partial<CollectionResponseDto>
> {
  uuid: string;

  createdAt: Date;

  @Expose({ groups: [UserRoles.ADMIN] })
  updatedAt: Date;

  @Expose({ groups: [UserRoles.ADMIN] })
  name: string;

  @Expose({ groups: [UserRoles.ADMIN] })
  nameInFrench: string;

  @Expose({ groups: [UserRoles.ADMIN] })
  nameInVietnames: string;

  @Expose({ name: 'name', groups: [UserRoles.USER] })
  getNameByLanguage() {
    switch (this._language) {
      case LanguageCode.ENGLISH:
        return this.name;
      case LanguageCode.FRENCH:
        return this.nameInFrench;
      case LanguageCode.VIETNAMESE:
        return this.nameInVietnames;
    }
  }

  @Expose({ groups: [UserRoles.ADMIN] })
  description: string;

  @Expose({ groups: [UserRoles.ADMIN] })
  descriptionInFrench: string;

  @Expose({ groups: [UserRoles.ADMIN] })
  descriptionInVietnames: string;

  @Expose({ name: 'description', groups: [UserRoles.USER], toPlainOnly: true })
  getDescriptionByLanguage() {
    switch (this._language) {
      case LanguageCode.ENGLISH:
        return this.description;
      case LanguageCode.FRENCH:
        return this.descriptionInFrench;
      case LanguageCode.VIETNAMESE:
        return this.descriptionInVietnames;
    }
  }

  @Expose()
  @Reflect.metadata(CommonDataResponse.DTO_KEY, 'product')
  products: ProductDataResponseDto[];

  public create(
    data: CollectionResponseDto,
    language: LanguageCode,
    locale: string,
    dataResponseRole: UserRoles,
  ) {
    const obj: CollectionResponseDto = Object.create(
      CollectionResponseDto.prototype,
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
