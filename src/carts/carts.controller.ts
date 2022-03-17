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
import { GetUser } from '../auth/decorators/get-user.decorator';
import { AdminRoleGuard } from '../auth/guards/admin-role.guard';
import { LanguageCode } from '../common/entity-enum';
import { ApiResponseInterceptor } from '../common/interceptors/api-response.interceptor';
import { ResponseDataInterceptor } from '../common/interceptors/response.interceptor';
import { CartPriceResponseDTO } from '../common/price-info-res.dto';
import { User } from '../users/entities/user.entity';
import { AuthGuards, CalculatePriceInfo } from '../utils';
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
@UseGuards(...AuthGuards)
@UseInterceptors(new ApiResponseInterceptor())
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @ApiOperation({ summary: 'Get user cart information' })
  @Get('my_cart')
  @UseInterceptors(new ResponseDataInterceptor(new CartDataResponse()))
  findUserCart(@GetUser() user: User) {
    return this.cartsService.findUserCart(user);
  }

  @ApiOperation({ summary: 'Add or Delete cart item from cart' })
  @ApiBody({ type: UpdateCartDto })
  @Patch()
  @UsePipes(ValidationPipe)
  @UseInterceptors(new ResponseDataInterceptor(new CartDataResponse()))
  async update(
    @Body() updateCartDto: UpdateCartDto,
    @GetUser() user: User,
  ): Promise<Cart> {
    return await this.cartsService.update(updateCartDto, user);
  }
}
