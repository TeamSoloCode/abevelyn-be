import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CancelOrderDto {
  @ApiPropertyOptional({ description: 'The reason user cancel the order' })
  @IsOptional()
  @IsString()
  @MaxLength(512)
  cancelReason?: string;
}
