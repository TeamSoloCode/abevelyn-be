import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateColorDto {
  @ApiProperty()
  @MaxLength(128)
  @MinLength(3)
  name: string;

  @ApiProperty({
    description:
      'The hex code with show color on client. Ex: red, rbg(0,0,0), #262626',
  })
  @IsString()
  code: string;
}
