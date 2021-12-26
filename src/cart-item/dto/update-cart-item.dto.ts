import { PartialType } from '@nestjs/mapped-types';
import { IsInt, IsUUID } from 'class-validator';
import { CreateCartItemDto } from './create-cart-item.dto';

export class UpdateCartItemDto extends PartialType(CreateCartItemDto) {
  @IsUUID()
  cartItemId: string;

  @IsInt()
  quantity: number;
}
