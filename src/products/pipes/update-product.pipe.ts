import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { FetchDataQuery } from 'src/common/fetch-data-query';
import { isNumeric } from 'src/utils';
import { UpdateProductDto } from '../dto/update-product.dto';

@Injectable()
export class UpdateProductValidationPipe
  implements PipeTransform<UpdateProductDto, UpdateProductDto>
{
  transform(value: UpdateProductDto, metadata: ArgumentMetadata) {
    return value;
  }
}
