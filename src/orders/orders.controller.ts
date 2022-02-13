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
  create(@GetUser() user: User) {
    return this.ordersService.create(user);
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
    this.ordersService.findUserOrderById(id);
  }

  @ApiOperation({ summary: 'Get all order (Only be use by Admin)' })
  @Get()
  @UseGuards(AdminRoleGuard)
  @UseInterceptors(new ResponseDataInterceptor(new OrderDataResponseDTO()))
  findAll() {
    return this.ordersService.findAll();
  }

  @ApiOperation({ summary: 'Get any order by id (Only be use by Admin)' })
  @ApiParam({ name: 'id', description: 'Any order id' })
  @Get(':id')
  @UseGuards(AdminRoleGuard)
  @UseInterceptors(new ResponseDataInterceptor(new OrderDataResponseDTO()))
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @ApiOperation({ summary: 'Update order by id' })
  @ApiParam({ name: 'id', description: 'Any order id' })
  @Patch(':id')
  @UseInterceptors(new ResponseDataInterceptor(new OrderDataResponseDTO()))
  update(
    @Param('id') id: string,
    @GetUser() user: User,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.ordersService.updateUserOrder(id, user, updateOrderDto);
  }
}
