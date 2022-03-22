import { Exclude, Expose } from 'class-transformer';
import { OrderHistory } from '../../order-history/entities/order-history.entity';
import { CartItem } from '../../cart-item/entities/cart-item.entity';
import CommonDataResponse from '../../common/common-data-response.dto';
import { LanguageCode, OrderStatus, UserRoles } from '../../common/entity-enum';
import { SaleResponseDto } from '../../sales/dto/sale-response.dto';
import { User } from '../../users/entities/user.entity';

export class OrderDataResponseDTO extends CommonDataResponse<
  Partial<OrderDataResponseDTO>
> {
  cancelReason: string;

  rejectReason: string;

  status: OrderStatus;

  @Exclude({ toPlainOnly: true })
  orderHist: OrderHistory;

  @Expose({ name: 'orderHist' })
  getOrderHist = () => OrderHistory;

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
