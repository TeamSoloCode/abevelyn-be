import { PartialType } from '@nestjs/mapped-types';
import { PartialType as SwaggerPartialType } from '@nestjs/swagger';
import { CreateUserProfileDto } from './create-user-profile.dto';

export class SwagUpdateUserProfileDto extends SwaggerPartialType(
  CreateUserProfileDto,
) {}
export class UpdateUserProfileDto extends PartialType(CreateUserProfileDto) {}
