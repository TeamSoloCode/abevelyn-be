import { Exclude } from 'class-transformer';
import { Order } from '../../orders/entities/order.entity';
import CommonDataResponse from '../../common/common-data-response.dto';
import { LanguageCode, OrderStatus, UserRoles } from '../../common/entity-enum';

export class OrderHistDataResponseDTO extends CommonDataResponse<
  Partial<OrderHistDataResponseDTO>
> {
  cancelReason: string;

  rejectReason: string;

  status: OrderStatus;

  @Reflect.metadata(CommonDataResponse.DTO_KEY, 'order')
  orderHist: OrderHistDataResponseDTO;

  @Exclude()
  order: OrderHistDataResponseDTO;

  public create(
    data: any,
    language: LanguageCode,
    locale: string,
    dataResponseRole: UserRoles,
  ): Partial<OrderHistDataResponseDTO> {
    const obj: OrderHistDataResponseDTO = Object.create(
      OrderHistDataResponseDTO.prototype,
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
