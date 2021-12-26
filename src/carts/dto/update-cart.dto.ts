import { Optional } from '@nestjs/common';
import { PartialType } from '@nestjs/mapped-types';
import { IsArray, IsEnum, IsUUID } from 'class-validator';
import { UpdateCartItemDto } from 'src/cart-item/dto/update-cart-item.dto';
import { CreateCartDto } from './create-cart.dto';

export class UpdateCartDto extends PartialType(CreateCartDto) {
  @IsUUID()
  productId: string;
}
