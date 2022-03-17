import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { AdminRoleGuard } from '../auth/guards/admin-role.guard';
import { ApiResponseInterceptor } from '../common/interceptors/api-response.interceptor';
import { ResponseDataInterceptor } from '../common/interceptors/response.interceptor';
import { User } from '../users/entities/user.entity';
import { AuthGuards } from '../utils';
import { AddressesService } from './addresses.service';
import { AddressResponseDTO } from './dto/address-response.dto';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@ApiTags('Address APIs')
@ApiBearerAuth('access-token')
@Controller('addresses')
@UseInterceptors(new ApiResponseInterceptor())
@UseGuards(...AuthGuards)
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @ApiOperation({ summary: 'Create address' })
  @ApiBody({ type: CreateAddressDto })
  @Post()
  @UseInterceptors(new ResponseDataInterceptor(new AddressResponseDTO()))
  create(@Body() createAddressDto: CreateAddressDto, @GetUser() user: User) {
    return this.addressesService.create(user, createAddressDto);
  }

  @ApiOperation({ summary: 'Get all address in the database (Admin only)' })
  @Get()
  @UseGuards(AdminRoleGuard)
  @UseInterceptors(new ResponseDataInterceptor(new AddressResponseDTO()))
  findAll() {
    return this.addressesService.findAll(undefined, { relations: ['owner'] });
  }

  @ApiOperation({ summary: 'Get address by uuid (Admin only)' })
  @ApiParam({
    name: 'id',
    description: 'The uuid of the address you want to get',
  })
  @Get(':id')
  @UseGuards(AdminRoleGuard)
  findOne(@Param('id') id: string) {
    return this.addressesService.findOne(id);
  }

  @ApiOperation({ summary: 'Get address only by its owner' })
  @ApiParam({
    name: 'id',
    description: 'The uuid of the address you want to get',
  })
  @Get('my_address/:id')
  findAddressByUser(@Param('id') id: string, @GetUser() user: User) {
    return this.addressesService.findOne(id, user);
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
