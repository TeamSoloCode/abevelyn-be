import {
  classToPlain,
  Exclude,
  Expose,
  serialize,
  Type,
} from 'class-transformer';
import { LanguageCode, UserRoles } from 'src/common/entity-enum';
import { Color } from '../entities/color.entity';

export class ColorDataResponseDto {
  uuid: string;
  code: string;

  createdAt: Date;

  @Expose({ groups: [UserRoles.ADMIN] })
  updatedAt: Date;

  @Expose({ groups: [UserRoles.ADMIN] })
  name: string;

  @Expose({ groups: [UserRoles.ADMIN] })
  nameInFrench: string;

  @Expose({ groups: [UserRoles.ADMIN] })
  nameInVietnames: string;

  @Expose({ name: 'name', groups: [UserRoles.USER] })
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

  private _language: LanguageCode;

  static create(
    color: Color,
    language: LanguageCode = LanguageCode.ENGLISH,
    locale?: string,
    dataResponseRole?: UserRoles,
  ) {
    const obj: ColorDataResponseDto = Object.create(
      ColorDataResponseDto.prototype,
    );

    Object.assign(obj, classToPlain(color));

    obj._language = language;

    return classToPlain(obj, {
      excludePrefixes: ['_'],
      groups: [dataResponseRole],
    });
  }
}
