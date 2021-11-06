import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { SignInCredentialDto } from './dto/signin-credential.dto';
import { SignUpCredentialDto } from './dto/signup-credential.dto';
import { JwtPayload } from './jwt-payload.interface';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../users/repositories/user.repository';
import { User } from 'src/users/entities/user.entity';
import { UserRoles } from 'src/entity-enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(
    authCredentials: SignUpCredentialDto,
  ): Promise<{ accessToken: string; username: string }> {
    await this.userRepository.signUp(authCredentials);
    const { username, password } = authCredentials;
    /**
     * If user sign up success then auto sign in
     */
    const res = await this.signIn({ username, password });
    return res;
  }

  async signIn(
    authCrendentialsDto: SignInCredentialDto,
  ): Promise<{ accessToken: string; username: string }> {
    try {
      const user = await this.userRepository.validatePassword(
        authCrendentialsDto,
      );
      if (!user?.username)
        throw new UnauthorizedException(['Invalid username or password']);

      const payload: JwtPayload = {
        uuid: user.uuid,
        username: user.username,

        salt: await bcrypt.genSalt(),
      };

      const accessToken = await this.jwtService.sign(payload);
      await this.userRepository.update(
        { uuid: user.uuid },
        { token: accessToken },
      );
      return { accessToken, username: user.username };
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async logOut(user: User) {
    try {
      await this.userRepository.update(user.uuid, {
        token: null,
        refreshToken: null,
      });
    } catch (err) {
      throw err;
    }
  }

  async isAdminRole(token: string): Promise<boolean> {
    const { uuid } = this.jwtService.verify<JwtPayload>(token);

    if (uuid) {
      const user = await this.userRepository.findOne(uuid);
      return user.role == UserRoles.ADMIN;
    }
    return false;
  }

  async isMatchStoragedToken(sentToken: string): Promise<boolean> {
    const { uuid } = this.jwtService.verify<JwtPayload>(sentToken);

    if (uuid) {
      const user = await this.userRepository.findOne(uuid);
      return user.token == sentToken;
    }
    return false;
  }

  isTokenExpired(sentToken: string): boolean {
    const result = this.jwtService.decode(sentToken);
    if (typeof result == 'string') return false;
    return Date.now() >= result.exp * 1000;
  }

  async isValidToken(sentToken: string): Promise<boolean> {
    return (
      (await this.isMatchStoragedToken(sentToken)) &&
      this.isTokenExpired(sentToken)
    );
  }
}
