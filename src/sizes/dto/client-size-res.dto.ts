import { LanguageCode } from 'src/entity-enum';
import { Size } from '../entities/size.entity';

export class ClientSizeResponseDto {
  constructor(size: Size, language: LanguageCode) {
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
    } = size;

    Object.assign(this, size);

    this.updatedAt = updatedAt;
    this.createdAt = createdAt;

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

  name: string;
  description: string;
  updatedAt: Date;
  createdAt: Date;
}
