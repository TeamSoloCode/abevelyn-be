import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

export class CreateOrderDto {
  @ApiPropertyOptional({ description: 'The order sale uuid' })
  @IsUUID()
  @IsOptional()
  orderSaleId?: string;
}
