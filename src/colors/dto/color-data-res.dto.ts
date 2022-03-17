import { ApiProperty } from '@nestjs/swagger';
import {
  classToPlain,
  Exclude,
  Expose,
  serialize,
  Transform,
  TransformClassToPlain,
  Type,
} from 'class-transformer';
import CommonDataResponse from '../../common/common-data-response.dto';
import { LanguageCode, UserRoles } from '../../common/entity-enum';
import { Color } from '../entities/color.entity';

export class ColorDataResponseDto extends CommonDataResponse<
  Partial<ColorDataResponseDto>
> {
  constructor() {
    super();
  }

  @ApiProperty()
  uuid: string;
  @ApiProperty()
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

  create(
    color: ColorDataResponseDto,
    language: LanguageCode = LanguageCode.ENGLISH,
    locale: string,
    dataResponseRole: UserRoles,
  ): ColorDataResponseDto {
    const obj: ColorDataResponseDto = Object.create(
      ColorDataResponseDto.prototype,
    );

    Object.assign(obj, classToPlain(color));
    obj._language = language;

    return <ColorDataResponseDto>classToPlain(obj, {
      excludePrefixes: ['_'],
      groups: [dataResponseRole],
    });
  }
}
