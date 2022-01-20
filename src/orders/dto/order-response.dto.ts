import { CartItem } from 'src/cart-item/entities/cart-item.entity';
import CommonDataResponse from 'src/common/common-data-response.dto';
import { LanguageCode, OrderStatus, UserRoles } from 'src/common/entity-enum';
import { User } from 'src/users/entities/user.entity';

export class OrderDataResponseDTO extends CommonDataResponse<
  Partial<OrderDataResponseDTO>
> {
  cancelReason: string;

  rejectReason: string;

  status: OrderStatus;

  @Reflect.metadata(CommonDataResponse.DTO_KEY, 'cartItem')
  cartItems: CartItem[];

  @Reflect.metadata(CommonDataResponse.DTO_KEY, 'user')
  owner: User;

  public create(
    data: any,
    language: LanguageCode,
    locale: string,
    dataResponseRole: UserRoles,
  ): Partial<OrderDataResponseDTO> {
    const obj: OrderDataResponseDTO = Object.create(
      OrderDataResponseDTO.prototype,
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
