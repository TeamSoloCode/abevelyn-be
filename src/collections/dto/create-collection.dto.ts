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
  @MinLength(1)
  name: string;

  @IsIn([true, false])
  available: boolean = true;

  @IsOptional()
  image?: string;
}
