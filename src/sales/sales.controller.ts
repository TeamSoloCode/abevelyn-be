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
import { ApiResponseInterceptor } from 'src/common/interceptors/api-response.interceptor';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ResponseMessageInterceptor } from 'src/common/interceptors/response-message.interceptor';
import { AuthGuards } from 'src/utils';

@ApiTags('Sale APIs')
@Controller('sales')
@UseInterceptors(new ApiResponseInterceptor())
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @ApiBearerAuth('access-token')
  @Post()
  @UseGuards(...AuthGuards, AdminRoleGuard)
  @UseInterceptors(
    new ResponseMessageInterceptor<SaleResponseDto>({
      201: (data) => {
        return `Create sale '${data.name}' successful!`;
      },
    }),
    new ResponseDataInterceptor(new SaleResponseDto()),
  )
  @UsePipes(ValidationPipe)
  create(@Body() createSaleDto: CreateSaleDto) {
    return this.salesService.create(createSaleDto);
  }

  @ApiBearerAuth('access-token')
  @Get()
  @UseGuards(...AuthGuards, AdminRoleGuard)
  @UseInterceptors(new ResponseDataInterceptor(new SaleResponseDto()))
  findAll(
    @Query(ValidationPipe, FetchDataQueryValidationPipe)
    query: FetchDataQuery,
  ) {
    return this.salesService.findAllSale(query);
  }

  @Get('fetch_available')
  @UseInterceptors(new ResponseDataInterceptor(new SaleResponseDto()))
  fetchAvailable(
    @Query(ValidationPipe, FetchDataQueryValidationPipe)
    query: FetchDataQuery,
  ) {
    return this.salesService.findAvailableSale(query);
  }

  @Get(':id')
  @UseInterceptors(new ResponseDataInterceptor(new SaleResponseDto()))
  findOne(@Param('id') id: string) {
    return this.salesService.findOne(id);
  }

  @ApiBearerAuth('access-token')
  @Patch(':id')
  @UseGuards(...AuthGuards, AdminRoleGuard)
  @UseInterceptors(
    new ResponseMessageInterceptor<SaleResponseDto>({
      200: (data) => {
        return `Update sale '${data.name}' successful!`;
      },
    }),
    new ResponseDataInterceptor(new SaleResponseDto()),
  )
  update(@Param('id') id: string, @Body() updateSaleDto: UpdateSaleDto) {
    return this.salesService.update(id, updateSaleDto);
  }
}
