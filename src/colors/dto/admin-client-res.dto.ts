import { LanguageCode } from 'src/entity-enum';
import { Color } from '../entities/color.entity';

export class AdminColorResponseDto {
  constructor(color: Color, language: LanguageCode = LanguageCode.ENGLISH) {
    const {
      uuid,
      updatedAt,
      createdAt,
      name,
      nameInFrench,
      nameInVietnames,
      code,
    } = color;

    Object.assign(this, color);

    this.uuid = uuid;
    this.code = code;
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
