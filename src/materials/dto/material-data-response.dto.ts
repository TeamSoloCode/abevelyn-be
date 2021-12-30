import { classToPlain, Expose } from 'class-transformer';
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

  @Expose({ name: 'description', groups: [UserRoles.USER] })
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

  @Reflect.metadata(CommonDataResponse.DTO_KEY, 'product')
  products: ProductDataResponseDto[];

  public create(
    data: Material,
    language: LanguageCode,
    locale: string,
    dataResponseRole: UserRoles,
  ): Partial<MaterialResponseDto> {
    const obj: ProductDataResponseDto = Object.create(
      ProductDataResponseDto.prototype,
    );

    obj._language = language;

    Object.keys(data).forEach((key) => {
      const dtoMetadata = Reflect.getMetadata(
        CommonDataResponse.DTO_KEY,
        obj,
        key,
      );
      if (dtoMetadata) {
        data[key] = Object.create(DTOKeyPrototypeMapper[dtoMetadata]).create(
          data[key],
          language,
          locale,
          dataResponseRole,
        );
      }
    });

    Object.assign(obj, classToPlain(data));

    return classToPlain(obj, {
      excludePrefixes: ['_'],
      groups: [dataResponseRole],
    });
  }
}
