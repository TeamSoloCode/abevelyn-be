import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import { SaleType, SaleUnit } from '../../common/entity-enum';

export class CreateSaleDto {
  @ApiProperty({ description: 'The event name of the sale' })
  @MinLength(1)
  @IsString()
  name: string;

  @ApiProperty({ description: 'The sale of value', minimum: 0.01 })
  @IsNumber()
  @Min(0.01)
  saleOff: number;

  @IsString()
  startedDate: Date;

  @IsString()
  expiredDate: Date;

  @ApiProperty({
    description: `The type of the sale saling for (${Object.values(
      SaleType,
    ).filter((v) => typeof v == 'string')})`,
    enum: SaleType,
  })
  @IsEnum(Object.values(SaleType).filter((v) => typeof v == 'string'))
  saleType: SaleType;

  @ApiPropertyOptional({ description: 'The max sale client can get' })
  @IsOptional()
  @IsNumber()
  maxOff: number;

  @ApiProperty({
    description: `The unit will be use (${Object.values(SaleUnit).filter(
      (v) => typeof v == 'string',
    )})`,
    enum: SaleUnit,
  })
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
