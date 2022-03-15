import { classToPlain, Exclude, Expose } from 'class-transformer';
import { CartItemDataResponseDTO } from 'src/cart-item/dto/cart-item-data-response.dto';
import { CartItem } from 'src/cart-item/entities/cart-item.entity';
import CommonDataResponse from 'src/common/common-data-response.dto';
import { LanguageCode, UserRoles } from 'src/common/entity-enum';
import { Sale } from 'src/sales/entities/sale.entity';
import { User } from 'src/users/entities/user.entity';
import { CalculatePriceInfo } from 'src/utils';

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
