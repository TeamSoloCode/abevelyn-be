import { classToPlain, Expose } from 'class-transformer';
import { CartDataResponse } from 'src/carts/dto/cart-data-response.dto';
import { Cart } from 'src/carts/entities/cart.entity';
import CommonDataResponse from 'src/common/common-data-response.dto';
import { LanguageCode, UserRoles } from 'src/common/entity-enum';
import { Order } from 'src/orders/entities/order.entity';
import { ProductDataResponseDto } from 'src/products/dto/product-data-res.dto';
import { Product } from 'src/products/entities/product.entity';
import { UserDataResponse } from 'src/users/dto/user-data-response.dto';
import { User } from 'src/users/entities/user.entity';

export class CartItemDataResponseDTO extends CommonDataResponse<
  Partial<CartItemDataResponseDTO>
> {
  @Reflect.metadata(CommonDataResponse.DTO_KEY, 'product')
  product: ProductDataResponseDto;

  quantity: number;

  @Reflect.metadata(CommonDataResponse.DTO_KEY, 'cart')
  cart: CartDataResponse;

  order: Order;

  @Reflect.metadata(CommonDataResponse.DTO_KEY, 'user')
  owner: UserDataResponse;

  isSelected: boolean;

  @Expose({ groups: [UserRoles.ADMIN] })
  updatedDate: Date;

  @Expose({ name: 'price' })
  getCartItemPrice = () => Number;

  public create(
    data: any,
    language: LanguageCode,
    locale: string,
    dataResponseRole: UserRoles,
  ): Partial<CartItemDataResponseDTO> {
    const obj: CartItemDataResponseDTO = Object.create(
      CartItemDataResponseDTO.prototype,
    );

    obj._language = language;

    return this.serializeDataResponse(
      obj,
      data,
      language,
      locale,
      dataResponseRole,
    );
  }
}
