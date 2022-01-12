import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AdminRoleGuard } from 'src/auth/guards/admin-role.guard';
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@ApiTags('Address APIs')
@ApiBearerAuth('access-token')
@Controller('addresses')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @ApiOperation({ summary: 'Create address' })
  @ApiBody({ type: CreateAddressDto })
  @Post()
  create(@Body() createAddressDto: CreateAddressDto) {
    return this.addressesService.create(createAddressDto);
  }

  @ApiOperation({ summary: 'Get all address in the database (Admin only)' })
  @Get()
  @UseGuards(AdminRoleGuard)
  findAll() {
    return this.addressesService.findAll();
  }

  @ApiOperation({ summary: 'To get address by uuid' })
  @ApiParam({
    name: 'id',
    description: 'The uuid of the address you want to get',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.addressesService.findOne(id);
  }

  @ApiOperation({ summary: 'To update address by uuid' })
  @ApiParam({
    name: 'id',
    description: 'The uuid of the address you want to update',
  })
  @ApiBody({ type: UpdateAddressDto })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAddressDto: UpdateAddressDto) {
    return this.addressesService.update(+id, updateAddressDto);
  }
}
