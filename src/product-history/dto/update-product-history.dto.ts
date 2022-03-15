import { PartialType } from '@nestjs/swagger';
import { CreateProductHistoryDto } from './create-product-history.dto';

export class UpdateProductHistoryDto extends PartialType(CreateProductHistoryDto) {}
