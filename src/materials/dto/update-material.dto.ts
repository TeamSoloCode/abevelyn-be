import { PartialType } from '@nestjs/mapped-types';
import { IsOptional } from 'class-validator';
import { CreateMaterialDto } from './create-material.dto';

export class UpdateMaterialDto extends PartialType(CreateMaterialDto) {
  @IsOptional()
  name: string;

  @IsOptional()
  nameInFrench: string;

  @IsOptional()
  nameInVietnames: string;

  @IsOptional()
  description: string;

  @IsOptional()
  descriptionInFrench: string;

  @IsOptional()
  descriptionInVietnames: string;
}
