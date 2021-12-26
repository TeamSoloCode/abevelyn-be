import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { FetchDataQuery } from 'src/common/fetch-data-query';
import {
  generateConditions,
  generateConditionToSQLQuery,
  generateOrderFromObject,
  generateOrderToSQLQuery,
} from 'src/utils';

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

    result.limit = value.limit ? Number(value.limit) : undefined;
    result.offset = value.offset ? Number(value.offset) : undefined;
    result.cond = undefined;
    result.order = undefined;
    const conditionAsObject = value.cond ? JSON.parse(value.cond) : undefined;
    const orderByAsObject = value.order ? JSON.parse(value.order) : undefined;

    if (conditionAsObject) {
      result.cond = generateConditionToSQLQuery(conditionAsObject);
    }

    if (orderByAsObject) {
      result.order = generateOrderFromObject(orderByAsObject);
    }

    return result;
  }
}
