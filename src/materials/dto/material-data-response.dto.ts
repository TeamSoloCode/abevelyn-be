import {
  classToPlain,
  deserializeArray,
  Exclude,
  Expose,
  serialize,
  Type,
} from 'class-transformer';
import CommonDataResponse from 'src/common/common-data-response.dto';
import { LanguageCode, UserRoles } from 'src/common/entity-enum';
import { ProductDataResponseDto } from 'src/products/dto/product-data-res.dto';
import { Product } from 'src/products/entities/product.entity';
import { DTOKeyPrototypeMapper } from 'src/utils';
import { Material } from '../entities/material.entity';

export class MaterialResponseDto extends CommonDataResponse<
  Partial<MaterialResponseDto>
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
    data: MaterialResponseDto,
    language: LanguageCode,
    locale: string,
    dataResponseRole: UserRoles,
  ) {
    const obj: MaterialResponseDto = Object.create(
      MaterialResponseDto.prototype,
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
