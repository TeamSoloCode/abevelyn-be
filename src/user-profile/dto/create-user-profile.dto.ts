import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateUserProfileDto {
  @ApiProperty({
    description: 'User image url or image name on database',
  })
  @IsString()
  picture?: string;

  @ApiProperty({ description: 'User first name' })
  @IsString()
  firstName?: string;

  @ApiProperty({ description: 'User last name' })
  @IsString()
  lastName?: string;

  @ApiProperty({ description: 'User phone number' })
  @IsString()
  phone?: string;
}
