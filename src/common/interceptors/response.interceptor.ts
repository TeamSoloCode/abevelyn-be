import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ColorDataResponseDto } from 'src/colors/dto/color-data-res.dto';
import { ApiDataResponse } from 'src/utils';
import CommonDataResponse from '../common-data-response.dto';
import { LanguageCode, UserRoles } from '../entity-enum';

@Injectable()
export class ResponseDataInterceptor<T>
  implements NestInterceptor<T, ApiDataResponse<T | T[]>>
{
  constructor(responseDto: CommonDataResponse<T>) {
    this.responseDto = responseDto;
  }

  private responseDto: CommonDataResponse<T>;

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiDataResponse<T | T[]>> {
    const request: Request = context.switchToHttp().getRequest();

    // TODO: Put the url into env
    const dataResponseRole = [
      'http://localhost:8080',
      'https://localhost:8080',
    ].includes(request.headers.origin)
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

        return new ApiDataResponse(res);
      }),
    );
  }
}
