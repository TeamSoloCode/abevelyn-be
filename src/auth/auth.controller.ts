import {
  Body,
  Controller,
  Get,
  Post,
  Redirect,
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRoles } from '../common/entity-enum';
import { User } from '../users/entities/user.entity';
import { AuthService } from './auth.service';
import { GetUser } from './decorators/get-user.decorator';
import { SignInCredentialDto } from './dto/signin-credential.dto';
import { SignUpCredentialDto } from './dto/signup-credential.dto';
import { MatchStoredTokenGuard } from './guards/match-token.guard';
import { SignUpValidationPipe } from './pipes/signup.pipe';
import { Response } from 'express';
import { AdminRoleGuard } from './guards/admin-role.guard';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthGuards, ENV_PATH_NAME } from '../utils';
import { ConfigService } from '@nestjs/config';
import { IConfig } from '../config/configuration';

@ApiTags('Auth APIs')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    console.log('Environment Variables', configService.get(ENV_PATH_NAME));
  }

  @ApiBody({ type: SignUpCredentialDto })
  @Post('/signup')
  @UsePipes(ValidationPipe, SignUpValidationPipe)
  async signup(@Body() signUpCredentials: SignUpCredentialDto) {
    return this.authService.signUp(signUpCredentials);
  }

  @ApiBody({ type: SignInCredentialDto })
  @Post('/signin')
  async signin(@Body(ValidationPipe) authCredentials: SignInCredentialDto) {
    const { accessToken, username } = await this.authService.signIn(
      authCredentials,
    );
    return { username, accessToken };
  }

  @Post('/admin_signin')
  async admin_signin(
    @Body(ValidationPipe) authCredentials: SignInCredentialDto,
  ) {
    return this.authService.signIn(authCredentials, UserRoles.ADMIN);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get('redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    const googleUser = await this.authService.googleLogin(req);

    const { username, accessToken } = googleUser;

    res.cookie('token', accessToken);
    res.cookie('username', username);
    res.cookie('email', username);

    res.redirect(
      this.configService.get<IConfig>(ENV_PATH_NAME).Client.ClientDomain,
    );
    return;
  }

  @Get('google-admin')
  @UseGuards(AuthGuard('google-admin'))
  async googleAdminAuth(@Req() req) {}

  @Get('redirect-admin')
  @UseGuards(AuthGuard('google-admin'))
  async googleAdminAuthRedirect(@Req() req, @Res() res: Response) {
    const googleUser = await this.authService.googleLogin(req, true);

    const { username, accessToken } = googleUser;

    res.cookie('token', accessToken);
    res.cookie('username', username);
    res.cookie('email', username);

    res.redirect(
      this.configService.get<IConfig>(ENV_PATH_NAME).Client.AdminDomain,
    );
    return;
  }

  @Post('/logout')
  @UseGuards(...AuthGuards)
  logout(@GetUser() user: User) {
    return this.authService.logOut(user);
  }

  @Post('/admin_verify_token')
  @UseGuards(...AuthGuards, AdminRoleGuard)
  adminVarifyToken() {
    return { result: 'Authorized' };
  }

  @Post('/verify_token')
  @UseGuards(...AuthGuards)
  varifyToken() {
    return { result: 'Authorized' };
  }
}
