import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, MaxLength, MinLength } from 'class-validator';
import { CreateCollectionDto } from './create-collection.dto';

export class UpdateCollectionDto extends PartialType(CreateCollectionDto) {
  @IsOptional()
  @MaxLength(256)
  nameInFrench?: string;

  @IsOptional()
  @MaxLength(256)
  nameInVietnames?: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  descriptionInFrench?: string;

  @IsOptional()
  descriptionInVietnames?: string;

  @IsOptional()
  saleIds: string | string[];
}
