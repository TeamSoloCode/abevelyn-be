import { IsOptional, IsString } from 'class-validator';

export class CreateUserProfileDto {
  @IsOptional()
  @IsString()
  picture?: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;
}
