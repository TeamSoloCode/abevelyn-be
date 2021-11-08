import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateColorDto {
  @MaxLength(128)
  @MinLength(3)
  name: string;

  @IsOptional()
  @MaxLength(128)
  @MinLength(10)
  nameInFrench?: string;

  @IsOptional()
  @MaxLength(128)
  @MinLength(3)
  nameInVietnames?: string;

  @IsString()
  code: string;
}
