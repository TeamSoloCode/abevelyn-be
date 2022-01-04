import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ValidationPipe,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { FetchDataQueryValidationPipe } from 'src/auth/pipes/fetch-data-query.pipe';
import { FetchDataQuery } from 'src/common/fetch-data-query';
import { AuthGuard } from '@nestjs/passport';
import { AdminRoleGuard } from 'src/auth/guards/admin-role.guard';
import { ResponseDataInterceptor } from 'src/common/interceptors/response.interceptor';
import { SaleResponseDto } from './dto/sale-response.dto';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  @UseGuards(AuthGuard(), AdminRoleGuard)
  @UseInterceptors(new ResponseDataInterceptor(new SaleResponseDto()))
  @UsePipes(ValidationPipe)
  create(@Body() createSaleDto: CreateSaleDto) {
    return this.salesService.create(createSaleDto);
  }

  @Get()
  @UseGuards(AuthGuard(), AdminRoleGuard)
  @UseInterceptors(new ResponseDataInterceptor(new SaleResponseDto()))
  findAll(
    @Query(ValidationPipe, FetchDataQueryValidationPipe)
    query: FetchDataQuery,
  ) {
    return this.salesService.findAllSale(query);
  }

  @Get()
  @UseInterceptors(new ResponseDataInterceptor(new SaleResponseDto()))
  fetchAvailable(
    @Query(ValidationPipe, FetchDataQueryValidationPipe)
    query: FetchDataQuery,
  ) {
    return this.salesService.findAvailableSale(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSaleDto: UpdateSaleDto) {
    return this.salesService.update(+id, updateSaleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.salesService.remove(+id);
  }
}
