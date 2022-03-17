import { classToPlain, Exclude, Expose } from 'class-transformer';
import { CartItemDataResponseDTO } from '../../cart-item/dto/cart-item-data-response.dto';
import { CartItem } from '../../cart-item/entities/cart-item.entity';
import CommonDataResponse from '../../common/common-data-response.dto';
import { LanguageCode, UserRoles } from '../../common/entity-enum';
import { Sale } from '../../sales/entities/sale.entity';
import { User } from '../../users/entities/user.entity';

export class CartDataResponse extends CommonDataResponse<
  Partial<CartDataResponse>
> {
  uuid: string;
  createdAt: Date;

  @Exclude({ toPlainOnly: true })
  owner: User;

  @Reflect.metadata(CommonDataResponse.DTO_KEY, 'cartItem')
  cartItems: CartItemDataResponseDTO[] = [];

  @Expose({ groups: [UserRoles.ADMIN] })
  updatedAt: Date;

  @Expose({ name: 'price' })
  getCartPrice = (orderSales: Sale[] = []) => Number;

  public create(
    data: CartDataResponse,
    language: LanguageCode,
    locale: string,
    dataResponseRole: UserRoles,
  ): Partial<CartDataResponse> {
    const obj: CartDataResponse = Object.create(CartDataResponse.prototype);

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
