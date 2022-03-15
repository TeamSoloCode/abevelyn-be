import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';
export class SignUpCredentialDto {
  @ApiPropertyOptional()
  @IsString({ message: `username.${'Must be a string'}` })
  @MinLength(6, {
    message: `username.${'Username or Email must at least 6 charaters'}`,
  })
  username: string;

  @ApiPropertyOptional()
  @IsString({ message: `password.${'Must be a string'}` })
  @MinLength(4, { message: `password.${'Password must at least 4 charaters'}` })
  /**At least 1 upper 1 lower 1 special 1 number charater */
  // TODO: Need to enable when deploy production
  // @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: 'Password is too weak' })
  password: string;

  @ApiPropertyOptional()
  @IsString({ message: `confirmPassword.${'Must be a string'}` })
  @MinLength(4, {
    message: `confirmPassword.${'Password must at least 4 charaters'}`,
  })
  confirmPassword: string;
}
