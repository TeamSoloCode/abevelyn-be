import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItemService } from 'src/cart-item/cart-item.service';
import { CreateCartItemDto } from 'src/cart-item/dto/create-cart-item.dto';
import { CartItemRepository } from 'src/cart-item/repositories/cart-item.repository';
import { ProductRepository } from 'src/products/repositories/product.repository';
import { User } from 'src/users/entities/user.entity';
import { UserRepository } from 'src/users/repositories/user.repository';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Cart } from './entities/cart.entity';
import { CartRepository } from './repositories/cart.repository';

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(CartRepository)
    private readonly cartRepository: CartRepository,
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    @InjectRepository(CartItemRepository)
    private readonly cartItemRepository: CartItemRepository,
    @InjectRepository(ProductRepository)
    private readonly productRepository: ProductRepository,
    private readonly cartItemService: CartItemService,
  ) {}

  async create(user: User): Promise<Cart> {
    const newCart = this.cartRepository.create({ owner: user });
    return await this.cartRepository.save(newCart);
  }

  findAll() {
    return `This action returns all carts`;
  }

  async findUserCart(id: string, user: User) {
    let unpaidCart = await this.cartRepository.findOne({
      where: { owner: { uuid: user.uuid }, isPaid: false },
    });

    if (!unpaidCart) {
      const newCart = await this.create(user);
      unpaidCart = await this.cartRepository.save(newCart);
    }

    return unpaidCart;
  }

  async update(
    id: string,
    updateCartDto: UpdateCartDto,
    user: User,
  ): Promise<Cart> {
    const cart = await this.cartRepository.findOne({
      where: { uuid: id, owner: { uuid: user.uuid } },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const existCartItem = cart.cartItems.find(
      (item) => item.product.uuid === updateCartDto.productId,
    );

    if (existCartItem) {
      cart.removeCartItem(existCartItem);
    } else {
      const product = await this.productRepository.findOne(
        updateCartDto.productId,
      );
      const cartItem = await this.cartItemService.create(cart, product, user);
      cart.addCartItem(cartItem);
    }
    await this.cartRepository.save(cart);
    return await this.cartRepository.findOne(cart.uuid);
  }

  remove(id: number) {
    return `This action removes a #${id} cart`;
  }
}
