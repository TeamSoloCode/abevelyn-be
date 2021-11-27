import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../../users/entities/user.entity';

export const GetLanguageOnHeader = createParamDecorator(
  (data, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest();
    const language = request.get('Selected-Languge');
    return language;
  },
);
