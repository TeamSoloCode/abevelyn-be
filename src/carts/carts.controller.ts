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
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { AdminRoleGuard } from 'src/auth/guards/admin-role.guard';
import { ResponseDataInterceptor } from 'src/common/interceptors/response.interceptor';
import { User } from 'src/users/entities/user.entity';
import { CartsService } from './carts.service';
import { CartDataResponse } from './dto/cart-data-response.dto';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Cart } from './entities/cart.entity';

@Controller('carts')
@UseGuards(AuthGuard())
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Post()
  create(@Body() createCartDto: CreateCartDto, @GetUser() user: User) {
    return this.cartsService.create(user);
  }

  @Get()
  @UseGuards(AdminRoleGuard)
  findAll() {
    return this.cartsService.findAll();
  }

  @Get('my_cart')
  @UseInterceptors(new ResponseDataInterceptor(new CartDataResponse()))
  findUserCart(@Param('id') id: string, @GetUser() user: User) {
    return this.cartsService.findUserCart(id, user);
  }

  @Patch(':id')
  @UsePipes(ValidationPipe)
  async update(
    @Param('id') id: string,
    @Body() updateCartDto: UpdateCartDto,
    @GetUser() user: User,
  ): Promise<Cart> {
    return await this.cartsService.update(id, updateCartDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cartsService.remove(+id);
  }
}
