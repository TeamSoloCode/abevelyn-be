import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { plainToClass } from 'class-transformer';
import { IConfig } from 'config/configuration';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiDataResponse, ENV_PATH_NAME, _envConstants } from 'src/utils';
import CommonDataResponse from '../common-data-response.dto';
import { LanguageCode, UserRoles } from '../entity-enum';

@Injectable()
export class ResponseDataInterceptor<T> implements NestInterceptor<T> {
  constructor(responseDto: CommonDataResponse<T>) {
    this.responseDto = responseDto;
  }

  private responseDto: CommonDataResponse<T>;

  intercept(context: ExecutionContext, next: CallHandler): Observable<T | T[]> {
    const request: Request = context.switchToHttp().getRequest();
    const dataResponseRole = _envConstants.BE.AllowOrigins.includes(
      request.headers.origin,
    )
      ? UserRoles.ADMIN
      : UserRoles.USER;

    const language =
      <LanguageCode>request.get('language') || LanguageCode.ENGLISH;
    const locale = request.get('locale');

    return next.handle().pipe(
      map((value: T | T[]) => {
        let res: T | T[] = undefined;
        if (value instanceof Array) {
          res = value.map((v) => {
            return this.responseDto.create(
              v,
              language,
              locale,
              dataResponseRole,
            );
          });
        } else {
          res = this.responseDto.create(
            value,
            language,
            locale,
            dataResponseRole,
          );
        }

        return res;
      }),
    );
  }
}
