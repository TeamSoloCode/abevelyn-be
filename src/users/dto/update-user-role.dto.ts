import { IsEnum } from 'class-validator';
import { UserRoles } from 'src/common/entity-enum';

export class UpdateUserRoleDTO {
  @IsEnum(Object.values(UserRoles).filter((v) => typeof v == 'string'))
  role: UserRoles;
}
