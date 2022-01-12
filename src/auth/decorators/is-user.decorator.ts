import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const IsUser = createParamDecorator(
  (data, ctx: ExecutionContext): boolean => {
    const req: Request = ctx.switchToHttp().getRequest();
    return ['http://localhost:8080', 'https://localhost:8080'].includes(
      req.headers.origin,
    );
  },
);
