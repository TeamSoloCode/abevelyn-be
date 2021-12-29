import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsInt, IsOptional, IsUUID } from 'class-validator';
import { CreateCartItemDto } from './create-cart-item.dto';

export class UpdateCartItemDto extends PartialType(CreateCartItemDto) {
  @IsInt()
  quantity: number;

  @IsOptional()
  @IsBoolean()
  isSelected: boolean;
}
