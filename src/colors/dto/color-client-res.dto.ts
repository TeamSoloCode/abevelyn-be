import { LanguageCode } from 'src/entity-enum';
import { Color } from '../entities/color.entity';

export class ColorClientResponseDto {
  constructor(color: Color, language: LanguageCode = LanguageCode.ENGLISH) {
    const { uuid, updatedAt, createdAt, name, nameInFrench, nameInVietnames } =
      color;

    Object.assign(this, color);

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
  updatedAt: Date;
  createdAt: Date;
  name: string;
}
