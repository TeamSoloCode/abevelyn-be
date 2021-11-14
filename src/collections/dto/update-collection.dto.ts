import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, MaxLength, MinLength } from 'class-validator';
import { CreateCollectionDto } from './create-collection.dto';

export class UpdateCollectionDto extends PartialType(CreateCollectionDto) {
  @IsOptional()
  @MaxLength(256)
  @MinLength(10)
  nameInFrench?: string;

  @IsOptional()
  @MaxLength(256)
  @MinLength(10)
  nameInVietnames?: string;

  @IsOptional()
  @MinLength(10)
  description?: string;

  @IsOptional()
  @MinLength(10)
  descriptionInFrench?: string;

  @IsOptional()
  @MinLength(10)
  descriptionInVietnames?: string;
}
