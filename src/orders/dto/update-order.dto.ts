import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { OrderStatus } from 'src/common/entity-enum';
import { CreateOrderDto } from './create-order.dto';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @ApiProperty({ description: 'The reason user cancel the order' })
  @IsOptional()
  @IsString()
  cancelReason?: string;

  @ApiProperty({ description: 'The reason admin reject the order' })
  @IsOptional()
  @IsString()
  rejectReason?: string;

  @ApiProperty({
    description: 'The reason admin reject the order',
    enum: OrderStatus,
  })
  @IsEnum(Object.values(OrderStatus).filter((v) => typeof v == 'string'))
  @IsOptional()
  orderStatus: OrderStatus;
}
