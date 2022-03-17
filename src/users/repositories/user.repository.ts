import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { SignInCredentialDto } from '../../auth/dto/signin-credential.dto';
import { SignUpCredentialDto } from '../../auth/dto/signup-credential.dto';
import { SignInType, UserRoles } from '../../common/entity-enum';
import { EntityRepository, Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(signUpCredentialsDto: SignUpCredentialDto): Promise<User> {
    const { username, password } = signUpCredentialsDto;
    const salt = await bcrypt.genSalt();

    const user = new User();
    user.username = username;
    user.password = await this.hashPassword(password, salt);
    user.salt = salt;

    try {
      return user.save();
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        // duplicate user
        throw new ConflictException(['Username already exists!']);
      } else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }

  async validatePassword(
    authCredentialDto: SignInCredentialDto,
  ): Promise<User> {
    const { username, password } = authCredentialDto;

    const user = await this.findOne({ username });

    if (!user) {
      throw new NotFoundException('Invalid username or password');
    } else if (user.signupType !== SignInType.REGISTER) {
      throw new UnauthorizedException(
        'This user cannot be login with this method',
      );
    } else if (user && (await user.validatePassword(password))) {
      return user;
    }

    return null;
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
