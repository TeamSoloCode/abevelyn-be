import { Expose, Transform } from 'class-transformer';
import CommonDataResponse from 'src/common/common-data-response.dto';
import { LanguageCode, SaleUnit, UserRoles } from 'src/common/entity-enum';
import { ProductDataResponseDto } from 'src/products/dto/product-data-res.dto';
import { Product } from 'src/products/entities/product.entity';

export class SaleResponseDto extends CommonDataResponse<
  Partial<SaleResponseDto>
> {
  uuid: string;

  @Expose({ groups: [UserRoles.ADMIN] })
  updatedAt: Date;

  applyPrice: number;

  createdAt: Date;

  startedDate: Date;

  expiredDate: Date;

  saleOff: number;

  unit: SaleUnit;

  @Expose({ groups: [UserRoles.ADMIN] })
  name: string;

  @Expose({ groups: [UserRoles.ADMIN] })
  nameInFrench?: string;

  @Expose({ groups: [UserRoles.ADMIN] })
  nameInVietnamese?: string;

  @Expose({ groups: [UserRoles.ADMIN] })
  description?: string;

  @Expose({ groups: [UserRoles.ADMIN] })
  descriptionInFrench?: string;

  @Expose({ groups: [UserRoles.ADMIN] })
  descriptionInVietnamese?: string;

  @Reflect.metadata(CommonDataResponse.DTO_KEY, 'product')
  products: ProductDataResponseDto[];

  // collections: Collection[];

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

  public create(
    data: SaleResponseDto,
    language: LanguageCode = LanguageCode.ENGLISH,
    locale: string,
    dataResponseRole: UserRoles,
  ) {
    const obj: SaleResponseDto = Object.create(SaleResponseDto.prototype);

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
