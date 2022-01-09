import { Optional } from '@nestjs/common';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsUUID } from 'class-validator';
import { UpdateCartItemDto } from 'src/cart-item/dto/update-cart-item.dto';
import { CreateCartDto } from './create-cart.dto';

export class UpdateCartDto extends PartialType(CreateCartDto) {
  @ApiProperty({ description: 'the uuid of the added or deleted product' })
  @IsUUID()
  productId: string;

  @ApiProperty({
    enum: ['add', 'delete'],
    description: `'add' equals add new product, 'delete' to delete the product`,
  })
  @IsEnum(['add', 'delete'])
  action: 'add' | 'delete' = 'add';
}
