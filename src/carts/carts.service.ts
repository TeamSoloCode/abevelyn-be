import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import { CartItemService } from 'src/cart-item/cart-item.service';
import { CartItemRepository } from 'src/cart-item/repositories/cart-item.repository';
import { CommonService } from 'src/common/common-services.service';
import { ProductRepository } from 'src/products/repositories/product.repository';
import { SaleRepository } from 'src/sales/repositories/sale.repository';
import { User } from 'src/users/entities/user.entity';
import { UserRepository } from 'src/users/repositories/user.repository';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Cart } from './entities/cart.entity';
import { CartRepository } from './repositories/cart.repository';

@Injectable()
export class CartsService extends CommonService<Cart> {
  constructor(
    @InjectRepository(CartRepository)
    private readonly cartRepository: CartRepository,
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    @InjectRepository(CartItemRepository)
    private readonly cartItemRepository: CartItemRepository,
    @InjectRepository(ProductRepository)
    private readonly productRepository: ProductRepository,
    @InjectRepository(SaleRepository)
    private readonly saleRepository: SaleRepository,
    private readonly cartItemService: CartItemService,
  ) {
    super(cartRepository);
  }

  async create(user: User): Promise<Cart> {
    const newCart = this.cartRepository.create({ owner: user });
    return await this.cartRepository.save(newCart);
  }

  async findUserCart(user: User) {
    let userCart = await this.cartRepository.getUserCartWithoutOrderedItems(
      user,
    );

    /**
     * If cart has not non ordered items,
     * then get that cart and filter all the ordered items
     */
    if (!userCart) {
      userCart = await this.cartRepository.findOne({
        where: { owner: { uuid: user.uuid } },
      });
      userCart?.cartItems && (userCart.cartItems = []);
    }

    /**
     * Till this if user cart is still not already existed
     * Then create new one for that user
     */
    if (!userCart) {
      const newCart = await this.create(user);
      await this.cartRepository.save(newCart);
      userCart = await this.cartRepository.getUserCartWithoutOrderedItems(user);
    }

    return userCart;
  }

  async update(updateCartDto: UpdateCartDto, user: User): Promise<Cart> {
    let cart = await this.cartRepository.getUserCartWithoutOrderedItems(user);

    if (!cart) {
      cart = await this.findUserCart(user);
    }

    const product = await this.productRepository.findOne({
      where: { uuid: updateCartDto.productId, deleted: false, available: true },
    });

    if (updateCartDto.action === 'add') {
      const existCartItem = cart.cartItems.find(
        (item) =>
          item.product.uuid === updateCartDto.productId &&
          !item.order &&
          !item.deleted,
      );

      if (existCartItem) {
        return cart;
      }

      const cartItem = await this.cartItemService.create(cart, product, user);
      cart.addCartItem(cartItem);
    } else if (updateCartDto.action === 'delete') {
      const cartItem = await this.cartItemRepository.findOne({
        cart: { uuid: cart.uuid },
        product: { uuid: updateCartDto.productId },
      });

      if (!cartItem) {
        return cart;
      }

      // cartItem.deleted = true;
      await cartItem.remove();
    }

    await this.cartRepository.save(cart);
    return await this.cartRepository.findOne(cart.uuid);
  }
}
