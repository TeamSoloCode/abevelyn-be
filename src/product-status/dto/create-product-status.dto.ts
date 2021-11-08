import { IsOptional, MaxLength, MinLength } from 'class-validator';

export class CreateProductStatusDto {
  @MaxLength(256)
  @MinLength(3)
  name: string;

  @IsOptional()
  @MaxLength(256)
  @MinLength(3)
  nameInFrench?: string;

  @IsOptional()
  @MaxLength(256)
  @MinLength(3)
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
