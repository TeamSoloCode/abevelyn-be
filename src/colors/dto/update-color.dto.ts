import { PartialType } from '@nestjs/mapped-types';
import { ApiBody, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, MaxLength, MinLength } from 'class-validator';
import { CreateColorDto } from './create-color.dto';

export class UpdateColorDto extends PartialType(CreateColorDto) {
  @IsOptional()
  @MaxLength(128)
  @ApiPropertyOptional({
    description: 'The name of the color on Frech',
  })
  nameInFrench?: string;

  @IsOptional()
  @MaxLength(128)
  @ApiPropertyOptional({
    description: 'The name of the color on Vietnamese',
  })
  nameInVietnames?: string;
}
