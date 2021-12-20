import { PartialType } from '@nestjs/mapped-types';
import {
  IsNumber,
  IsOptional,
  IsUUID,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { isNumeric } from 'src/utils';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @IsOptional()
  @IsUUID()
  materialId?: string;

  @IsOptional()
  colectionIds?: string | string[];

  @IsOptional()
  @IsUUID()
  couponId?: string | string[];

  @IsOptional()
  image1?: string;

  @IsOptional()
  image2?: string;

  @IsOptional()
  image3?: string;

  @IsOptional()
  image4?: string;

  @IsOptional()
  image5?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  saleOf?: number = 0;

  @IsOptional()
  @ValidateIf((o) => isNumeric(o.price))
  quantity: number;

  @IsOptional()
  @MaxLength(512)
  @MinLength(10)
  nameInFrench?: string;

  @IsOptional()
  @MaxLength(512)
  @MinLength(10)
  nameInVietnames?: string;

  @IsOptional()
  @MinLength(10)
  descriptionInFrench?: string;

  @IsOptional()
  @MinLength(10)
  descriptionInVietnames?: string;
}
