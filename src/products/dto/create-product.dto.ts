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
  statusId: string;

  @IsUUID()
  sizeId: string;

  @IsString()
  image: string;

  @MinLength(10)
  description: string;
}
