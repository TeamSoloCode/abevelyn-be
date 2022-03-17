import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiResponseInterceptor } from 'src/common/interceptors/api-response.interceptor';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuards } from 'src/utils';
import { AdminRoleGuard } from 'src/auth/guards/admin-role.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { ResponseDataInterceptor } from 'src/common/interceptors/response.interceptor';
import { OrderDataResponseDTO } from './dto/order-response.dto';
import { ResponseMessageInterceptor } from 'src/common/interceptors/response-message.interceptor';
import { CancelOrderDto } from './dto/cancel-order.dto';

@ApiTags('Order APIs')
@ApiBearerAuth('access-token')
@Controller('orders')
@UseGuards(...AuthGuards)
@UseInterceptors(new ApiResponseInterceptor())
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiOperation({ summary: 'Create new order' })
  @Post()
  @UseInterceptors(new ResponseDataInterceptor(new OrderDataResponseDTO()))
  create(@Body() createOrderDto: CreateOrderDto, @GetUser() user: User) {
    return this.ordersService.create(user, createOrderDto.orderSaleId);
  }

  @ApiOperation({ summary: 'Get new order infomation' })
  @Post('pre-order-info')
  @UseInterceptors(new ResponseDataInterceptor(new OrderDataResponseDTO()))
  orderInformation(
    @Body() createOrderDto: CreateOrderDto,
    @GetUser() user: User,
  ) {
    return this.ordersService.create(user, createOrderDto.orderSaleId, true);
  }

  @ApiOperation({ summary: 'Get all order of user' })
  @Get('my_orders')
  @UseInterceptors(
    new ResponseMessageInterceptor<OrderDataResponseDTO>({
      201: (data) => {
        return `Order has been placed!`;
      },
    }),
    new ResponseDataInterceptor(new OrderDataResponseDTO()),
  )
  findAllUserOrder(@GetUser() user: User) {
    return this.ordersService.findUserOrders(user);
  }

  @ApiOperation({ summary: 'Get order by id (For client)' })
  @ApiParam({ name: 'id', description: 'Any order id' })
  @Get('my_orders/:id')
  @UseInterceptors(new ResponseDataInterceptor(new OrderDataResponseDTO()))
  findUserOrderById(@Param('id') id: string) {
    return this.ordersService.findUserOrderById(id);
  }

  @ApiOperation({ summary: 'Get all order (Only be use by Admin)' })
  @Get()
  @UseGuards(AdminRoleGuard)
  @UseInterceptors(new ResponseDataInterceptor(new OrderDataResponseDTO()))
  findAll() {
    return this.ordersService.findAll(undefined, {
      relations: ['owner', 'owner.profile'],
    });
  }

  @ApiOperation({ summary: 'Get any order by id (Only be use by Admin)' })
  @ApiParam({ name: 'id', description: 'Any order id' })
  @Get(':id')
  @UseGuards(AdminRoleGuard)
  @UseInterceptors(new ResponseDataInterceptor(new OrderDataResponseDTO()))
  findOne(@Param('id') id: string) {
    return this.ordersService.findOrderById(id);
  }

  @ApiOperation({ summary: 'Update order STATUS by id (Only be use by Admin)' })
  @ApiParam({ name: 'id', description: 'Any order id' })
  @UseGuards(AdminRoleGuard)
  @Patch(':id')
  @UseInterceptors(new ResponseDataInterceptor(new OrderDataResponseDTO()))
  updateOrderStatus(
    @Param('id') id: string,
    @Body(ValidationPipe) updateOrderDto: UpdateOrderDto,
  ) {
    return this.ordersService.updateOrderStatus(id, updateOrderDto);
  }

  @ApiOperation({ summary: 'User use this to cancel their order by order ID' })
  @ApiParam({ name: 'id', description: 'Any order id' })
  @Patch('cancel/:id')
  @UseInterceptors(new ResponseDataInterceptor(new OrderDataResponseDTO()))
  cancel(
    @Param('id') id: string,
    @GetUser() user: User,
    @Body(ValidationPipe) { cancelReason }: CancelOrderDto,
  ) {
    return this.ordersService.cancelOrder(id, user, cancelReason);
  }
}
