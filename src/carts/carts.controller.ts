import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UsePipes,
  ValidationPipe,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { AdminRoleGuard } from 'src/auth/guards/admin-role.guard';
import { LanguageCode } from 'src/common/entity-enum';
import { ResponseDataInterceptor } from 'src/common/interceptors/response.interceptor';
import { CartPriceResponseDTO } from 'src/common/price-info-res.dto';
import { User } from 'src/users/entities/user.entity';
import { CalculatePriceInfo } from 'src/utils';
import { CartsService } from './carts.service';
import { CartDataResponse } from './dto/cart-data-response.dto';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Cart } from './entities/cart.entity';

@ApiTags('Cart APIs')
@ApiHeader({
  name: 'language',
  enum: LanguageCode,
})
@ApiBearerAuth('access-token')
@Controller('carts')
@UseGuards(AuthGuard())
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @ApiOperation({ summary: 'Get user cart information' })
  @Get('my_cart')
  @UseInterceptors(new ResponseDataInterceptor(new CartDataResponse()))
  findUserCart(@GetUser() user: User) {
    return this.cartsService.findUserCart(user);
  }

  @ApiOperation({ summary: 'Get users cart total price' })
  @Get('cart_price')
  @UseInterceptors(new ResponseDataInterceptor(new CartPriceResponseDTO()))
  async getCartPriceInfomation(
    @GetUser() user: User,
  ): Promise<CalculatePriceInfo> {
    return this.cartsService.getPriceInformation(user);
  }

  @ApiOperation({ summary: 'Add or Delete cart item from cart' })
  @ApiParam({ name: 'id', description: 'The uuid of the cart' })
  @ApiBody({ type: UpdateCartDto })
  @Patch(':id')
  @UsePipes(ValidationPipe)
  @UseInterceptors(new ResponseDataInterceptor(new CartPriceResponseDTO()))
  async update(
    @Param('id') id: string,
    @Body() updateCartDto: UpdateCartDto,
    @GetUser() user: User,
  ): Promise<Cart> {
    return await this.cartsService.update(id, updateCartDto, user);
  }
}
