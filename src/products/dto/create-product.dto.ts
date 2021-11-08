import {
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @MaxLength(512)
  @MinLength(10)
  name: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsUUID()
  colorId: string;

  @IsUUID()
  productStatusId: string;

  @IsUUID()
  sizeId: string;

  @IsOptional()
  @IsUUID()
  couponId?: string;

  @IsUUID()
  productMaterialId: string;

  @IsOptional()
  @IsUUID()
  productColectionId?: string;

  @IsString()
  image: string;

  @IsOptional()
  @IsString()
  image1?: string;

  @IsOptional()
  @IsString()
  image2?: string;

  @IsOptional()
  @IsString()
  image3?: string;

  @IsOptional()
  @IsString()
  image4?: string;

  @IsOptional()
  @IsString()
  image5?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  saleOf?: number = 0;

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
  description?: string;

  @IsOptional()
  @MinLength(10)
  descriptionInFrench?: string;

  @IsOptional()
  @MinLength(10)
  descriptionInVietnames?: string;
}
