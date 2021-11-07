import {
  IsBoolean,
  IsEnum,
  IsIn,
  IsNumber,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateCollectionDto {
  @MaxLength(256)
  @MinLength(10)
  name: string;

  @IsOptional()
  @MaxLength(256)
  @MinLength(10)
  nameInFrench?: string;

  @IsOptional()
  @MaxLength(256)
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

  @IsOptional()
  @IsIn([true, false])
  available: boolean = true;
}
