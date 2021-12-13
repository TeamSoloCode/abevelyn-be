import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { FetchDataQuery } from 'src/fetch-data-query';
import { isNumeric } from 'src/utils';

@Injectable()
export class FetchDataQueryValidationPipe
  implements
    PipeTransform<
      { limit: string; offset: string; cond: string; order: string },
      FetchDataQuery
    >
{
  transform(
    value: { limit: string; offset: string; cond: string; order: string },
    metadata: ArgumentMetadata,
  ) {
    const result: FetchDataQuery = {};

    result.limit = Number(value.limit);
    result.offset = Number(value.offset);
    result.cond = value.cond ? JSON.parse(value.cond) : undefined;
    result.order = value.order ? JSON.parse(value.order) : undefined;

    return result;
  }
}
