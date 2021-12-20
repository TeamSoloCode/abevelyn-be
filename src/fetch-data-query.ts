import { IsJSON, IsNumber, IsNumberString, IsOptional } from 'class-validator';
import { OrderArrayType } from './utils';

export class FetchDataQuery {
  @IsOptional()
  @IsNumberString()
  limit?: number;

  @IsOptional()
  @IsNumberString()
  offset?: number;

  @IsOptional()
  @IsJSON()
  order?: OrderArrayType;

  @IsOptional()
  @IsJSON()
  cond?: string;
}
