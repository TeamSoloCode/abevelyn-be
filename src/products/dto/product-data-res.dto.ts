import { classToPlain, Expose, Transform } from 'class-transformer';
import { Collection } from 'src/collections/entities/collection.entity';
import { ColorDataResponseDto } from 'src/colors/dto/color-data-res.dto';
import CommonDataResponse from 'src/common/common-data-response.dto';
import { LanguageCode, UserRoles } from 'src/common/entity-enum';
import { MaterialResponseDto } from 'src/materials/dto/material-data-response.dto';
import { Material } from 'src/materials/entities/material.entity';
import { AdminProductStatusResponseDto } from 'src/product-status/dto/admin-product-status-res.dto';
import { AdminSizeResponseDto } from 'src/sizes/dto/admin-size-res.dto';
import { DTOKeyPrototypeMapper } from 'src/utils';

export class ProductDataResponseDto extends CommonDataResponse<
  Partial<ProductDataResponseDto>
> {
  constructor() {
    super();
  }

  uuid: string;

  @Expose({ groups: [UserRoles.ADMIN] })
  updatedAt: Date;

  createdAt: Date;

  @Expose({ groups: [UserRoles.ADMIN] })
  name: string;

  @Expose({ groups: [UserRoles.ADMIN] })
  nameInFrench: string;

  @Expose({ groups: [UserRoles.ADMIN] })
  nameInVietnamese: string;

  @Expose({ groups: [UserRoles.ADMIN] })
  description?: string;

  @Expose({ groups: [UserRoles.ADMIN] })
  descriptionInFrench?: string;

  @Expose({ groups: [UserRoles.ADMIN] })
  descriptionInVietnamese?: string;

  size: AdminSizeResponseDto;
  productStatus: AdminProductStatusResponseDto;

  @Reflect.metadata(CommonDataResponse.DTO_KEY, 'color')
  color: ColorDataResponseDto;

  @Reflect.metadata(CommonDataResponse.DTO_KEY, 'material')
  materials: MaterialResponseDto[];

  collections: Collection[];

  @Expose({ name: 'name', groups: [UserRoles.USER], toPlainOnly: true })
  getNameByLanguage() {
    switch (this._language) {
      case LanguageCode.ENGLISH:
        return this.name;
      case LanguageCode.FRENCH:
        return this.nameInFrench;
      case LanguageCode.VIETNAMESE:
        return this.nameInVietnamese;
    }
  }

  @Expose({ name: 'description', groups: [UserRoles.USER], toPlainOnly: true })
  getDescriptionByLanguage() {
    switch (this._language) {
      case LanguageCode.ENGLISH:
        return this.name;
      case LanguageCode.FRENCH:
        return this.nameInFrench;
      case LanguageCode.VIETNAMESE:
        return this.nameInVietnamese;
    }
  }

  create(
    data: ProductDataResponseDto,
    language: LanguageCode = LanguageCode.ENGLISH,
    locale: string,
    dataResponseRole: UserRoles,
  ) {
    const obj: ProductDataResponseDto = Object.create(
      ProductDataResponseDto.prototype,
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