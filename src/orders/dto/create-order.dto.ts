import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({ description: 'The cart items uuid' })
  @IsArray()
  cartItemIds: string[];
}
