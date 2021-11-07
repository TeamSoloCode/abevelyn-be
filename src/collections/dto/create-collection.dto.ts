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
  @MinLength(10)
  description?: string;

  @IsOptional()
  @IsIn([true, false])
  available: boolean = true;
}
