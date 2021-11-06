import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class MatchStoredTokenGuard implements CanActivate {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext) {
    try {
      const request = context.switchToHttp().getRequest();
      const Authorization = request.get('Authorization');

      if (Authorization) {
        const token = Authorization.replace('Bearer ', '');
        const authorized = await this.authService.isMatchStoragedToken(token);
        if (authorized) return true;
        throw new UnauthorizedException(
          'Some one just login with your account !',
        );
      }
      return false;
    } catch (err) {
      if (!(err instanceof UnauthorizedException)) {
        throw new UnauthorizedException('Your login token is expired');
      }
      throw err;
    }
  }
}
