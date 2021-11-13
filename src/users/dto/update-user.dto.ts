import { IsEnum, IsOptional } from 'class-validator';
import { UserRoles } from 'src/entity-enum';

export class UpdateUserDto {
    @IsOptional()
    @IsEnum(UserRoles, {message: 'Role must be root, admin or user'})
    role: UserRoles
}