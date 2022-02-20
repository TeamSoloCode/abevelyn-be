import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateAddressDto {
  @ApiPropertyOptional({ description: 'The label name of the address' })
  @IsOptional()
  @IsString()
  addressName: string;

  @ApiProperty({ description: 'The address street' })
  @IsString()
  street: string;

  @ApiPropertyOptional({ description: 'The address province' })
  @IsString()
  @IsOptional()
  provinceOrState: string;

  @ApiPropertyOptional({ description: 'The address district' })
  @IsString()
  @IsOptional()
  district: string;

  @ApiPropertyOptional({ description: 'The address country' })
  @IsString()
  @IsOptional()
  country: string;

  @ApiPropertyOptional({ description: 'The address post code' })
  @IsOptional()
  @IsString()
  postCode: string;

  @ApiPropertyOptional({ description: 'The company of the address' })
  @IsOptional()
  @IsString()
  companyName: string;

  @ApiPropertyOptional({
    description: "Set to 'true' if you want this is you default address",
  })
  @IsOptional()
  @IsBoolean()
  isDefaultAddress: boolean;
}
