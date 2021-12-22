import { Collection } from 'src/collections/entities/collection.entity';
import { ColorDataResponseDto } from 'src/colors/dto/color-data-res.dto';
import { LanguageCode } from 'src/common/entity-enum';
import { AdminProductStatusResponseDto } from 'src/product-status/dto/admin-product-status-res.dto';
import { AdminSizeResponseDto } from 'src/sizes/dto/admin-size-res.dto';
import { Product } from '../entities/product.entity';

export class AdminProductResponseDto {
  constructor(product: Product, language: LanguageCode = LanguageCode.ENGLISH) {
    const {
      available,
      uuid,
      updatedAt,
      createdAt,
      name,
      description,
      nameInFrench,
      nameInVietnamese,
      descriptionInFrench,
      descriptionInVietnamese,
      deleted,
      coupon,
      color,
      productStatus,
      size,
    } = product;

    Object.assign(this, product);

    this.updatedAt = updatedAt;
    this.createdAt = createdAt;

    this.size = new AdminSizeResponseDto(size, language);
    this.color = ColorDataResponseDto.create(color, language);
    this.productStatus = new AdminProductStatusResponseDto(
      productStatus,
      language,
    );

    switch (language) {
      case LanguageCode.ENGLISH:
        this.name = name;
        this.description = description;
        break;
      case LanguageCode.FRENCH:
        this.name = nameInFrench;
        this.description = descriptionInFrench;
        break;
      case LanguageCode.VIETNAMESE:
        this.name = nameInVietnamese;
        this.description = descriptionInVietnamese;
        break;
    }
  }

  uuid: string;
  updatedAt: Date;
  createdAt: Date;
  name: string;
  description: string;

  size: AdminSizeResponseDto;
  productStatus: AdminProductStatusResponseDto;
  color: Record<string, any>;
  collections: Collection[];
}
