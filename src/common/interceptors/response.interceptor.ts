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
import { ApiResponse } from 'src/utils';
import CommonDataResponse from '../common-data-response.dto';
import { LanguageCode, UserRoles } from '../entity-enum';

@Injectable()
export class ResponseDataInterceptor<T, M>
  implements NestInterceptor<T, ApiResponse<M | M[]>>
{
  constructor(responseDto: CommonDataResponse<M>) {
    this.transferData = responseDto.create;
  }

  private transferData: (
    data: T,
    language: LanguageCode,
    locale: string,
    dataResponseRole: UserRoles,
  ) => M;

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<M | M[]>> {
    const request: Request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    // TODO: Put the url into env
    const dataResponseRole =
      request.headers.origin == 'http://localhost:8080' ||
      request.headers.origin == 'https://localhost:8080'
        ? UserRoles.ADMIN
        : UserRoles.USER;

    const language = <LanguageCode>request.get('language');
    const locale = request.get('locale');

    return next.handle().pipe(
      map((value: T | T[]) => {
        let res: M | M[] = undefined;
        if (value instanceof Array) {
          res = value.map((v) => {
            return this.transferData(v, language, locale, dataResponseRole);
          });
        } else {
          res = this.transferData(value, language, locale, dataResponseRole);
        }

        return new ApiResponse(res, 'Action Successful!');
      }),
    );
  }
}
