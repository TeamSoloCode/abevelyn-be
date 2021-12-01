import { LanguageCode } from 'src/entity-enum';
import { ProductStatus } from '../entities/product-status.entity';

export class AdminProductStatusResponseDto {
  constructor(
    productStatus: ProductStatus,
    language: LanguageCode = LanguageCode.ENGLISH,
  ) {
    const { uuid, updatedAt, createdAt, name, nameInFrench, nameInVietnames } =
      productStatus;

    Object.assign(this, productStatus);

    this.uuid = uuid;
    this.updatedAt = updatedAt;
    this.createdAt = createdAt;

    switch (language) {
      case LanguageCode.ENGLISH:
        this.name = name;
        break;
      case LanguageCode.FRENCH:
        this.name = nameInFrench;
        break;
      case LanguageCode.VIETNAMESE:
        this.name = nameInVietnames;
        break;
    }
  }

  uuid: string;
  code: string;
  updatedAt: Date;
  createdAt: Date;
  name: string;
}
