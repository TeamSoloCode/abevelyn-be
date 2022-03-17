import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { UserRoles } from '../../common/entity-enum';

export class UpdateUserRoleDTO {
  @ApiProperty({ description: 'New role of the user' })
  @IsEnum(Object.values(UserRoles).filter((v) => typeof v == 'string'))
  role: UserRoles;
}
