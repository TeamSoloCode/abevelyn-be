import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { classToClass, plainToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { get, set } from 'lodash';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiDataResponse } from '../../utils';
import CommonDataResponse from '../common-data-response.dto';
import { LanguageCode, UserRoles } from '../entity-enum';

@Injectable()
export class ApiResponseInterceptor<T>
  implements NestInterceptor<T, ApiDataResponse<T | T[]>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiDataResponse<T | T[]>> {
    const response: Response = context.switchToHttp().getResponse();
    return next.handle().pipe(
      map((value: any) => {
        return new ApiDataResponse(
          value,
          response.statusMessage,
          response.statusCode + '',
        );
      }),
    );
  }
}
