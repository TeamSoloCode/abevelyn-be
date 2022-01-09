import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsUUID } from 'class-validator';
import { CreateCartItemDto } from './create-cart-item.dto';

export class UpdateCartItemDto extends PartialType(CreateCartItemDto) {
  @ApiProperty({ description: 'The quantity of the product in the cart item' })
  @IsInt()
  quantity: number;

  @ApiProperty({
    description:
      "The flag to check is the cart item selected or not. If it's selected it we be in the total price and order",
  })
  @IsOptional()
  @IsBoolean()
  isSelected: boolean;
}
