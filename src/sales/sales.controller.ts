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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiTags,
  PartialType,
} from '@nestjs/swagger';
import { ResponseMessageInterceptor } from 'src/common/interceptors/response-message.interceptor';
import { AuthGuards } from 'src/utils';
import { SaleType } from 'src/common/entity-enum';

@ApiTags('Sale APIs')
@Controller('sales')
@UseInterceptors(new ApiResponseInterceptor())
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create Sale (Admin Only)' })
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
  @ApiOperation({ summary: 'Fetch all sale (Admin Only)' })
  @Get()
  @UseGuards(...AuthGuards, AdminRoleGuard)
  @UseInterceptors(new ResponseDataInterceptor(new SaleResponseDto()))
  findAll(
    @Query(ValidationPipe, FetchDataQueryValidationPipe)
    query: FetchDataQuery,
  ) {
    return this.salesService.findAllSale(query);
  }

  @ApiOperation({ summary: 'Fetch all available sale' })
  @ApiQuery({ required: false, name: 'type', enum: SaleType })
  @Get('fetch_available')
  @UseInterceptors(new ResponseDataInterceptor(new SaleResponseDto()))
  fetchAvailable(
    @Query('type')
    saleType: SaleType,
  ) {
    return this.salesService.findAvailableSale(saleType);
  }

  @ApiOperation({ summary: 'Fetch a sale by id' })
  @Get(':id')
  @UseInterceptors(new ResponseDataInterceptor(new SaleResponseDto()))
  findOne(@Param('id') id: string) {
    return this.salesService.findOne(id);
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update sale infomation (Admin Only)' })
  @ApiBody({ type: UpdateSaleDto })
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
  update(
    @Param('id') id: string,
    @Body(
      new ValidationPipe({
        transformOptions: { excludeExtraneousValues: true },
      }),
    )
    updateSaleDto: UpdateSaleDto,
  ) {
    return this.salesService.update(id, updateSaleDto);
  }
}
