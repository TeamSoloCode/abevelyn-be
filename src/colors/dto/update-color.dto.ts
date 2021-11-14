import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, MaxLength, MinLength } from 'class-validator';
import { CreateColorDto } from './create-color.dto';

export class UpdateColorDto extends PartialType(CreateColorDto) {
  @IsOptional()
  @MaxLength(128)
  nameInFrench?: string;

  @IsOptional()
  @MaxLength(128)
  nameInVietnames?: string;
}
