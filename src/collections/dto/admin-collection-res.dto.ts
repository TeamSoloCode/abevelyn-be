import { Coupon } from 'src/coupons/entities/coupon.entity';
import { LanguageCode } from 'src/entity-enum';
import { Product } from 'src/products/entities/product.entity';
import { Collection } from '../entities/collection.entity';

export class AdminCollectionResponseDto {
  constructor(
    collection: Collection,
    language: LanguageCode = LanguageCode.ENGLISH,
  ) {
    const {
      available,
      uuid,
      updatedAt,
      createdAt,
      name,
      description,
      nameInFrench,
      nameInVietnames,
      descriptionInFrench,
      descriptionInVietnames,
      deleted,
      coupon,
    } = collection;

    Object.assign(this, collection);

    this.updatedAt = updatedAt;
    this.createdAt = createdAt;
    this.coupon = coupon;

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
        this.name = nameInVietnames;
        this.description = descriptionInVietnames;
        break;
    }
  }

  uuid: string;
  updatedAt: Date;
  createdAt: Date;
  name: string;
  description: string;
  coupon: Coupon;
  products: Product[];
}
