import { IsJSON, IsNumber, IsNumberString, IsOptional } from 'class-validator';
import { String } from 'lodash';
import { FindManyOptions } from 'typeorm';

export class FetchDataQuery {
  @IsOptional()
  @IsNumberString()
  limit?: number;

  @IsOptional()
  @IsNumberString()
  offset?: number;

  @IsOptional()
  @IsJSON()
  order?: object;

  @IsOptional()
  @IsJSON()
  cond?: string;
}
