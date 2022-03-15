import { PartialType } from '@nestjs/mapped-types';
import { PartialType as PartialTypeSwagger } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { SaleUnit } from 'src/common/entity-enum';
import { CreateSaleDto } from './create-sale.dto';

export class UpdateSaleDto extends PartialType(CreateSaleDto) {}
