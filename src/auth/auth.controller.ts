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
import { UserRoles } from 'src/common/entity-enum';
import { User } from 'src/users/entities/user.entity';
import { AuthService } from './auth.service';
import { GetUser } from './decorators/get-user.decorator';
import { SignInCredentialDto } from './dto/signin-credential.dto';
import { SignUpCredentialDto } from './dto/signup-credential.dto';
import { MatchStoredTokenGuard } from './guards/match-token.guard';
import { SignUpValidationPipe } from './pipes/signup.pipe';
import { Response } from 'express';
import { AdminRoleGuard } from './guards/admin-role.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @UsePipes(ValidationPipe, SignUpValidationPipe)
  async signup(@Body() signUpCredentials: SignUpCredentialDto) {
    return this.authService.signUp(signUpCredentials);
  }

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
  @Redirect('http://localhost:8080')
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    const googleUser = await this.authService.googleLogin(req);

    const { username, accessToken } = googleUser;

    res.cookie('token', accessToken);
    res.cookie('username', username);
    res.cookie('email', username);
  }

  @Post('/logout')
  @UseGuards(MatchStoredTokenGuard, AuthGuard())
  logout(@GetUser() user: User) {
    return this.authService.logOut(user);
  }

  @Post('/admin_verify_token')
  @UseGuards(AuthGuard(), MatchStoredTokenGuard, AdminRoleGuard)
  adminVarifyToken() {
    return { result: 'Authorized' };
  }

  @Post('/verify_token')
  @UseGuards(AuthGuard(), MatchStoredTokenGuard)
  varifyToken() {
    return { result: 'Authorized' };
  }
}
