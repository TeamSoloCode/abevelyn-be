import { classToPlain, Expose } from 'class-transformer';
import { Collection } from 'src/collections/entities/collection.entity';
import { ColorDataResponseDto } from 'src/colors/dto/color-data-res.dto';
import CommonDataResponse from 'src/common/common-data-response.dto';
import { LanguageCode, UserRoles } from 'src/common/entity-enum';
import { AdminProductStatusResponseDto } from 'src/product-status/dto/admin-product-status-res.dto';
import { AdminSizeResponseDto } from 'src/sizes/dto/admin-size-res.dto';
import { DTOKeyPrototypeMapper, DTO_KEY } from 'src/utils';

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
  nameInVietnames: string;

  description: string;

  size: AdminSizeResponseDto;
  productStatus: AdminProductStatusResponseDto;

  // @Type(() => ColorDataResponseDto)
  @Reflect.metadata(DTO_KEY, 'color')
  color: ColorDataResponseDto;

  collections: Collection[];

  @Expose({ name: 'name', groups: [UserRoles.USER], toPlainOnly: true })
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

  create(
    product: ProductDataResponseDto,
    language: LanguageCode = LanguageCode.ENGLISH,
    locale: string,
    dataResponseRole: UserRoles,
  ) {
    const obj: ProductDataResponseDto = Object.create(
      ProductDataResponseDto.prototype,
    );

    obj._language = language;

    Object.keys(product).forEach((key) => {
      const dtoMetadata = Reflect.getMetadata(DTO_KEY, obj, key);
      if (dtoMetadata) {
        product[key] = Object.create(DTOKeyPrototypeMapper[dtoMetadata]).create(
          product[key],
          language,
          locale,
          dataResponseRole,
        );
      }
    });

    Object.assign(obj, classToPlain(product));

    return classToPlain(obj, {
      excludePrefixes: ['_'],
      groups: [dataResponseRole],
    });
  }
}
