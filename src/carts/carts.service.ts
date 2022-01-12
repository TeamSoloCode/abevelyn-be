import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItemService } from 'src/cart-item/cart-item.service';
import { CreateCartItemDto } from 'src/cart-item/dto/create-cart-item.dto';
import { CartItemRepository } from 'src/cart-item/repositories/cart-item.repository';
import { ProductRepository } from 'src/products/repositories/product.repository';
import { User } from 'src/users/entities/user.entity';
import { UserRepository } from 'src/users/repositories/user.repository';
import { CalculatePriceInfo } from 'src/utils';
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

  async findUserCart(user: User) {
    let userCart = await this.cartRepository.findOne({
      where: { owner: { uuid: user.uuid } },
    });

    if (!userCart) {
      const newCart = await this.create(user);
      userCart = await this.cartRepository.save(newCart);
    }

    return this.cartRepository.findOne({
      where: { uuid: userCart.uuid },
    });
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

    const product = await this.productRepository.findOne(
      updateCartDto.productId,
    );

    if (updateCartDto.action === 'add') {
      const existCartItem = cart.cartItems.find(
        (item) => item.product.uuid === updateCartDto.productId,
      );

      if (existCartItem) {
        return cart;
      }

      const cartItem = await this.cartItemService.create(cart, product, user);
      cart.addCartItem(cartItem);
      await this.cartRepository.save(cart);
      return await this.cartRepository.findOne(cart.uuid);
    } else if (updateCartDto.action === 'delete') {
      const cartItem = await this.cartItemRepository.findOne({
        cart: { uuid: cart.uuid },
        product: { uuid: updateCartDto.productId },
      });

      if (cartItem) {
        cart.removeCartItem(cartItem);
        await this.cartRepository.save(cart);
        return await this.cartRepository.findOne(cart.uuid);
      }

      return cart;
    }
  }

  async getPriceInformation(user: User): Promise<CalculatePriceInfo> {
    const cart = await this.cartRepository.findOne({
      relations: [
        'cartItems',
        'cartItems.product',
        'cartItems.product.collections',
        'cartItems.product.sales',
        'cartItems.product.collections.sales',
        'owner',
      ],
      where: { owner: { uuid: user.uuid } },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    return cart.getCartPrice();
  }
}
