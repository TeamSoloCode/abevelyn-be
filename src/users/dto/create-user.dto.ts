import { IsString, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
    @MaxLength(128)
    @MinLength(3)
    name: string;
  
    @IsString()
    code: string;
}
