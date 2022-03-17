import {
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from 'class-validator';

import _ from 'lodash';
import { isNumeric } from '../../utils';

export class CreateProductDto {
  @MaxLength(512)
  @MinLength(10)
  name: string;

  @ValidateIf((o) => isNumeric(o.price))
  price: number;

  @IsUUID()
  colorId: string;

  @IsUUID()
  statusId: string;

  @IsUUID()
  sizeId: string;

  image: string;

  @MinLength(10)
  description: string;
}
