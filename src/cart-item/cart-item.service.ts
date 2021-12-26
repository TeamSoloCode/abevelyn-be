import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from 'src/carts/entities/cart.entity';
import { CommonService } from 'src/common/common-services.service';
import { FetchDataQuery } from 'src/common/fetch-data-query';
import { Product } from 'src/products/entities/product.entity';
import { User } from 'src/users/entities/user.entity';
import { IsNull, Not } from 'typeorm';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { CartItem } from './entities/cart-item.entity';
import { CartItemRepository } from './repositories/cart-item.repository';

@Injectable()
export class CartItemService extends CommonService<CartItem> {
  constructor(
    @InjectRepository(CartItemRepository)
    private readonly cartItemRepository: CartItemRepository,
  ) {
    super(cartItemRepository);
  }

  create(cart: Cart, product: Product, user: User) {
    const newCartitem = new CartItem(cart, product, user);
    return this.cartItemRepository.save(newCartitem);
  }

  findAllCartitem(query: FetchDataQuery) {
    return this.findAll(query);
  }

  findAvailableCartItems(user: User) {
    return this.findAvailable(
      {},
      {
        where: { owner: { uuid: user.uuid }, cart: { uuid: Not(IsNull()) } },
      },
    );
  }

  async findOne(id: string, user: User): Promise<CartItem> {
    const cartItem = await this.cartItemRepository.findOne({
      uuid: id,
      owner: { uuid: user.uuid },
    });
    return cartItem;
  }

  update(id: number, updateCartItemDto: UpdateCartItemDto) {
    return `This action updates a #${id} cartItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} cartItem`;
  }
}
