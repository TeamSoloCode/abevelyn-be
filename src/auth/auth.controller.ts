import {
  Body,
  Controller,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/users/entities/user.entity';
import { AuthService } from './auth.service';
import { GetUser } from './decorators/get-user.decorator';
import { SignInCredentialDto } from './dto/signin-credential.dto';
import { SignUpCredentialDto } from './dto/signup-credential.dto';
import { MatchStoredTokenGuard } from './guards/match-token.guard';
import { SignUpValidationPipe } from './pipes/signup.pipe';

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
    return this.authService.signIn(authCredentials);
  }

  @Post('/logout')
  @UseGuards(MatchStoredTokenGuard, AuthGuard())
  logout(@GetUser() user: User) {
    return this.authService.logOut(user);
  }

  @Post('/verify_token')
  @UseGuards(AuthGuard(), MatchStoredTokenGuard)
  test(@GetUser() user: User) {
    return { result: 'Authorized' };
  }
}
