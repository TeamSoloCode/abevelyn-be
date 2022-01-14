import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDate,
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { SaleType, SaleUnit } from 'src/common/entity-enum';

export class CreateSaleDto {
  @ApiProperty({ description: 'The event name of the sale' })
  @MinLength(1)
  @IsString()
  name: string;

  @ApiProperty({ description: 'The sale of value', minimum: 0.5 })
  @IsNumber()
  @Min(0.5)
  saleOff: number;

  @IsDateString()
  startedDate: Date;

  @IsDateString()
  expiredDate: Date;

  @IsEnum(Object.values(SaleType).filter((v) => typeof v == 'string'))
  saleType: SaleType;

  @IsOptional()
  @IsEnum(Object.values(SaleUnit).filter((v) => typeof v == 'string'))
  unit: SaleUnit;

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
  applyPrice?: number;

  @IsOptional()
  @IsArray()
  productIds: string[];

  @IsOptional()
  @IsArray()
  collectionIds: string[];

  @IsOptional()
  @IsArray()
  orderIds: string[];
}
