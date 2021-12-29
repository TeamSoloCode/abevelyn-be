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
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { AdminRoleGuard } from 'src/auth/guards/admin-role.guard';
import { FetchDataQueryValidationPipe } from 'src/auth/pipes/fetch-data-query.pipe';
import { FetchDataQuery } from 'src/common/fetch-data-query';
import { User } from 'src/users/entities/user.entity';
import { CartItemService } from './cart-item.service';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Controller('cart-item')
export class CartItemController {
  constructor(private readonly cartItemService: CartItemService) {}

  @Get()
  @UseGuards(AuthGuard(), AdminRoleGuard)
  findAll(
    @Query(ValidationPipe, FetchDataQueryValidationPipe)
    query: FetchDataQuery,
  ) {
    return this.cartItemService.findAllCartitem(query);
  }

  @Get('fetch_available')
  @UseGuards(AuthGuard())
  findAvailable(@GetUser() user: User) {
    return this.cartItemService.findAvailableCartItems(user);
  }

  @Get(':id')
  @UseGuards(AuthGuard())
  findOne(@Param('id') id: string, @GetUser() user: User) {
    return this.cartItemService.findOne(id, user);
  }

  @Patch(':id')
  @UseGuards(AuthGuard())
  @UsePipes(ValidationPipe)
  update(
    @Param('id') id: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
    @GetUser() user: User,
  ) {
    return this.cartItemService.update(id, updateCartItemDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cartItemService.remove(+id);
  }
}
