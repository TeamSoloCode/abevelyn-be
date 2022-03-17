import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { SignInCredentialDto } from './dto/signin-credential.dto';
import { SignUpCredentialDto } from './dto/signup-credential.dto';
import { JwtPayload } from './jwt-payload.interface';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../users/repositories/user.repository';
import { User } from '../users/entities/user.entity';
import { UserRoles } from '../common/entity-enum';
import { GoogleLoginResponseDTO } from './dto/google-login-response.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
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
    as: UserRoles = UserRoles.USER,
  ): Promise<{ accessToken: string; username: string }> {
    try {
      const user = await this.userRepository.validatePassword(
        authCrendentialsDto,
      );
      if (!user?.username)
        throw new UnauthorizedException(['Invalid username or password']);

      if (as !== UserRoles.USER && user.role !== as) {
        throw new UnauthorizedException(['You are not ADMIN to login']);
      }

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
      return user.role == UserRoles.ADMIN || user.role == UserRoles.ROOT;
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

  async fetchUserByToken(token: string): Promise<User> {
    const { uuid } = this.jwtService.verify<JwtPayload>(token);
    try {
      return await this.userRepository.findOne(uuid);
    } catch (err) {
      throw err;
    }
  }

  async googleLogin(
    req,
    isAdmin: boolean = false,
  ): Promise<{ accessToken: string; username: string }> {
    if (!req.user) {
      throw new UnauthorizedException('Cannot loggin with this account!');
    }

    let res = new GoogleLoginResponseDTO();
    res = <GoogleLoginResponseDTO>req.user;

    const user = await this.userService.loginWithGoogle(res, isAdmin);

    if (!user && isAdmin) {
      throw new UnauthorizedException();
    }

    const payload: JwtPayload = {
      uuid: user.uuid,
      username: user.email,
      salt: await bcrypt.genSalt(),
    };

    const accessToken = await this.jwtService.sign(payload);

    await this.userRepository.update(
      { uuid: user.uuid },
      { token: accessToken },
    );

    return { accessToken, username: user.email };
  }
}
