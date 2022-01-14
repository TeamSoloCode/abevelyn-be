import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

type FunctionMessage<T> = (data: T) => string;

@Injectable()
export class ResponseMessageInterceptor<T>
  implements NestInterceptor<T, T | T[]>
{
  constructor(
    messageMapper?: Record<string | number, string | FunctionMessage<T>>,
  ) {
    this.messageMapper = messageMapper;
  }

  private messageMapper?: Record<string | number, string | FunctionMessage<T>>;

  intercept(context: ExecutionContext, next: CallHandler): Observable<T | T[]> {
    const response: Response = context.switchToHttp().getResponse();
    const message = this.messageMapper[response.statusCode];

    return next.handle().pipe(
      map((value: any) => {
        const isArray = value instanceof Array;
        response.statusMessage =
          message instanceof Function
            ? message(isArray ? value[0] || 0 : value)
            : message || response.statusMessage;

        return value;
      }),
    );
  }
}
