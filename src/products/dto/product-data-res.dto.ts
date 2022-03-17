import { classToPlain, Exclude, Expose, Transform } from 'class-transformer';
import { Collection } from '../../collections/entities/collection.entity';
import { ColorDataResponseDto } from '../../colors/dto/color-data-res.dto';
import CommonDataResponse from '../../common/common-data-response.dto';
import { LanguageCode, UserRoles } from '../../common/entity-enum';
import { MaterialResponseDto } from '../../materials/dto/material-data-response.dto';
import { AdminProductStatusResponseDto } from '../../product-status/dto/admin-product-status-res.dto';
import { SaleResponseDto } from '../../sales/dto/sale-response.dto';
import { AdminSizeResponseDto } from '../../sizes/dto/admin-size-res.dto';
import { CalculatePriceInfo, DTOKeyPrototypeMapper } from '../../utils';

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

  price: number;

  size: AdminSizeResponseDto;

  productStatus: AdminProductStatusResponseDto;

  @Reflect.metadata(CommonDataResponse.DTO_KEY, 'color')
  color: ColorDataResponseDto;

  @Reflect.metadata(CommonDataResponse.DTO_KEY, 'material')
  materials: MaterialResponseDto[];

  @Reflect.metadata(CommonDataResponse.DTO_KEY, 'sale')
  sales: SaleResponseDto[];

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
        return this.description;
      case LanguageCode.FRENCH:
        return this.descriptionInFrench;
      case LanguageCode.VIETNAMESE:
        return this.descriptionInVietnamese;
    }
  }

  @Expose({ name: 'priceInfo', toPlainOnly: true })
  getPrice = () => CalculatePriceInfo;

  create(
    data: ProductDataResponseDto,
    language: LanguageCode = LanguageCode.ENGLISH,
    locale: string,
    dataResponseRole: UserRoles,
  ): Partial<ProductDataResponseDto> {
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
