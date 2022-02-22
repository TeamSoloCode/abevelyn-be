import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRoles } from 'src/common/entity-enum';
import { AuthService } from '../auth.service';

@Injectable()
export class RootRoleGuard implements CanActivate {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext) {
    try {
      const request = context.switchToHttp().getRequest();
      const Authorization = request.get('Authorization');

      if (Authorization) {
        const token = Authorization.replace('Bearer ', '');
        const user = await this.authService.fetchUserByToken(token);
        const isRoot = user.role == UserRoles.ROOT;
        const isMatchStoredToken = user.token == token;
        if (isRoot && isMatchStoredToken) return true;

        if (!isRoot) {
          throw new UnauthorizedException(
            'You are not a ROOT admin to do this action',
          );
        } else {
          throw new UnauthorizedException(
            'Your token is expired! Please sign in again.',
          );
        }
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
