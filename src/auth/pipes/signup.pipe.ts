import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { SignUpCredentialDto } from '../dto/signup-credential.dto';

@Injectable()
export class SignUpValidationPipe implements PipeTransform<SignUpCredentialDto> {
  transform(value: SignUpCredentialDto, metadata: ArgumentMetadata) {
    if (value.confirmPassword != value.password) {
      throw new BadRequestException([`confirmPassword.${'Confirm password is not match the password'}`]);
    }
    return value;
  }
}
