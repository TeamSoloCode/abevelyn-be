import { PartialType } from '@nestjs/mapped-types';
import { IsArray, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { SaleUnit } from 'src/common/entity-enum';
import { CreateSaleDto } from './create-sale.dto';

export class UpdateSaleDto extends PartialType(CreateSaleDto) {
  @IsOptional()
  name: string;

  @IsOptional()
  nameInFrench?: string;

  @IsOptional()
  nameInVietnamese?: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  descriptionInFrench?: string;

  @IsOptional()
  descriptionInVietnamese?: string;

  @IsOptional()
  @IsArray()
  productIds: string[];

  @IsOptional()
  @IsArray()
  collectionIds: string[];
}
