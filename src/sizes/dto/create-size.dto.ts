import { IsIn, IsOptional, MaxLength, MinLength } from 'class-validator';

export class CreateSizeDto {
  @MaxLength(256)
  @MinLength(1)
  name: string;

  @IsIn([true, false])
  available: boolean = true;

  @IsOptional()
  @MaxLength(256)
  @MinLength(1)
  nameInFrench?: string;

  @IsOptional()
  @MaxLength(256)
  @MinLength(1)
  nameInVietnames?: string;

  @IsOptional()
  @MinLength(3)
  description?: string;

  @IsOptional()
  @MinLength(3)
  descriptionInFrench?: string;

  @IsOptional()
  @MinLength(3)
  descriptionInVietnames?: string;
}
