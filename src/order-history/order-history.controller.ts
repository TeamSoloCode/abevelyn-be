import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FetchDataQueryValidationPipe } from '../auth/pipes/fetch-data-query.pipe';
import { AdminRoleGuard } from '../auth/guards/admin-role.guard';
import { AuthGuards } from '../utils';
import { OrderHistoryService } from './order-history.service';
import { FetchDataQuery } from '../common/fetch-data-query';
import { ResponseDataInterceptor } from '../common/interceptors/response.interceptor';
import { OrderHistDataResponseDTO } from './dto/order-history-response.dto';
import { ApiResponseInterceptor } from '../common/interceptors/api-response.interceptor';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';

@ApiTags('Order History APIs')
@ApiBearerAuth('access-token')
@Controller('order-history')
@UseGuards(...AuthGuards)
@UseInterceptors(new ApiResponseInterceptor())
export class OrderHistoryController {
  constructor(private readonly orderHistoryService: OrderHistoryService) {}

  @ApiOperation({ summary: 'Get all order history (Only used by Admin)' })
  @Get()
  @UseGuards(AdminRoleGuard)
  @UseInterceptors(new ResponseDataInterceptor(new OrderHistDataResponseDTO()))
  findAll(
    @Query(ValidationPipe, FetchDataQueryValidationPipe)
    query: FetchDataQuery,
  ) {
    return this.orderHistoryService.fetchAllOrderHistory(query);
  }

  @ApiOperation({ summary: 'Get all my order history' })
  @Get('/my_order_history')
  @UseInterceptors(new ResponseDataInterceptor(new OrderHistDataResponseDTO()))
  findAllMyOrderHistory(
    @Query(ValidationPipe, FetchDataQueryValidationPipe)
    query: FetchDataQuery,
    @GetUser() user: User,
  ) {
    return this.orderHistoryService.fetchAllMyOrderHist(query, user);
  }

  @ApiOperation({ summary: 'Get my order history by id' })
  @UseInterceptors(new ResponseDataInterceptor(new OrderHistDataResponseDTO()))
  @Get('my_order_history/:id')
  findMyOrderHistoryById(@Param('id') id: string, @GetUser() user: User) {
    return this.orderHistoryService.fetchOrderById(id, user);
  }

  @ApiOperation({ summary: 'Get order history by id (Only used by Admin)' })
  @UseGuards(AdminRoleGuard)
  @UseInterceptors(new ResponseDataInterceptor(new OrderHistDataResponseDTO()))
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderHistoryService.fetchOrderById(id);
  }
}
