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
  UsePipes,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { AdminRoleGuard } from '../auth/guards/admin-role.guard';
import { FetchDataQueryValidationPipe } from '../auth/pipes/fetch-data-query.pipe';
import { FetchDataQuery } from '../common/fetch-data-query';
import { ApiResponseInterceptor } from '../common/interceptors/api-response.interceptor';
import { ResponseDataInterceptor } from '../common/interceptors/response.interceptor';
import { CartPriceResponseDTO } from '../common/price-info-res.dto';
import { User } from '../users/entities/user.entity';
import { AuthGuards, CalculatePriceInfo } from '../utils';
import { CartItemService } from './cart-item.service';
import { CartItemDataResponseDTO } from './dto/cart-item-data-response.dto';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@ApiTags('Cart item APIs')
@ApiBearerAuth('access-token')
@Controller('cart-item')
@UseGuards(...AuthGuards)
@UseInterceptors(new ApiResponseInterceptor())
export class CartItemController {
  constructor(private readonly cartItemService: CartItemService) {}
  @ApiOperation({ summary: 'Get all cart items' })
  @Get()
  @UseGuards(AdminRoleGuard)
  findAll(
    @Query(ValidationPipe, FetchDataQueryValidationPipe)
    query: FetchDataQuery,
  ) {
    return this.cartItemService.findAllCartitem(query);
  }

  @ApiOperation({ summary: 'Get all available cart items' })
  @Get('fetch_available')
  findAvailable(@GetUser() user: User) {
    return this.cartItemService.findAvailableCartItems(user);
  }

  @ApiOperation({ summary: 'Get the cart item by id' })
  @ApiParam({ name: 'id', description: 'the uuid of the cart item' })
  @Get(':id')
  @UseInterceptors(new ResponseDataInterceptor(new CartItemDataResponseDTO()))
  findOne(@Param('id') id: string, @GetUser() user: User) {
    return this.cartItemService.findOne(id, user);
  }

  @ApiOperation({
    summary: 'Update the cart item by id, (quantity, selected flag)',
  })
  @ApiParam({ name: 'id', description: 'The uuid of the cart item' })
  @Patch(':id')
  @UsePipes(ValidationPipe)
  update(
    @Param('id') id: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
    @GetUser() user: User,
  ) {
    return this.cartItemService.update(id, updateCartItemDto, user);
  }
}
