import { CartItem } from 'src/cart-item/entities/cart-item.entity';
import CommonDataResponse from 'src/common/common-data-response.dto';
import { LanguageCode, OrderStatus, UserRoles } from 'src/common/entity-enum';
import { SaleResponseDto } from 'src/sales/dto/sale-response.dto';
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

  @Reflect.metadata(CommonDataResponse.DTO_KEY, 'sale')
  sale: SaleResponseDto;

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
