import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  IsString,
  IS_ALPHA,
  MaxLength,
} from 'class-validator';
import { OrderStatus } from 'src/common/entity-enum';
import { CreateOrderDto } from './create-order.dto';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @ApiPropertyOptional({ description: 'The reason user cancel the order' })
  @IsOptional()
  @IsString()
  @MaxLength(512)
  cancelReason?: string;

  @ApiProperty({ description: 'The reason admin reject the order' })
  @IsOptional()
  @IsString()
  @MaxLength(512)
  rejectReason?: string;

  @ApiProperty({
    description: 'The reason admin reject the order',
    enum: OrderStatus,
  })
  @IsEnum(Object.values(OrderStatus).filter((v) => typeof v == 'string'))
  orderStatus: OrderStatus;
}
