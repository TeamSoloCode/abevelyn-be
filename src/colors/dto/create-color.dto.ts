import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateColorDto {
  @MaxLength(128)
  @MinLength(3)
  name: string;

  @IsString()
  code: string;
}
