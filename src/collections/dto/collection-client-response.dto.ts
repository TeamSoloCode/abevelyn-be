import { Coupon } from 'src/coupons/entities/coupon.entity';
import { LanguageCode } from 'src/entity-enum';
import { ProductColection } from 'src/products/entities/product_collection.entity';
import { Collection } from '../entities/collection.entity';

export class CollectionResponseDto {
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
      productCollection,
    } = collection;

    Object.assign(this, collection);

    this.available = available;
    this.uuid = uuid;
    this.updatedAt = updatedAt;
    this.createdAt = createdAt;
    this.deleted = deleted;
    this.coupon = coupon;
    this.productCollection = productCollection;

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
  available: boolean;
  deleted: boolean;
  coupon: Coupon;
  productCollection: ProductColection[];
}
