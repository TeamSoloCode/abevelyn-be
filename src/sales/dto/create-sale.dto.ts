import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { SaleUnit } from 'src/common/entity-enum';

export class CreateSaleDto {
  @IsNumber()
  saleOff: number;

  @IsDateString()
  startedDate: Date;

  @IsDateString()
  expiredDate: Date;

  @IsOptional()
  @IsNumber()
  maxOff: number;

  @IsOptional()
  @IsEnum(Object.values(SaleUnit).filter((v) => typeof v == 'string'))
  unit: SaleUnit;
}
