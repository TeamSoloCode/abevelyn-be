import { Expose } from 'class-transformer';
import { CartDataResponse } from '../../carts/dto/cart-data-response.dto';
import CommonDataResponse from '../../common/common-data-response.dto';
import { LanguageCode, UserRoles } from '../../common/entity-enum';
import { OrderDataResponseDTO } from '../../orders/dto/order-response.dto';
import { ProductDataResponseDto } from '../../products/dto/product-data-res.dto';
import { UserDataResponse } from '../../users/dto/user-data-response.dto';
import { CalculatePriceInfo } from '../../utils';

export class CartItemDataResponseDTO extends CommonDataResponse<
  Partial<CartItemDataResponseDTO>
> {
  @Reflect.metadata(CommonDataResponse.DTO_KEY, 'product')
  product: ProductDataResponseDto;

  quantity: number;

  @Reflect.metadata(CommonDataResponse.DTO_KEY, 'cart')
  cart: CartDataResponse;

  @Reflect.metadata(CommonDataResponse.DTO_KEY, 'order')
  order: OrderDataResponseDTO;

  @Reflect.metadata(CommonDataResponse.DTO_KEY, 'user')
  owner: UserDataResponse;

  isSelected: boolean;

  @Expose({ groups: [UserRoles.ADMIN] })
  updatedDate: Date;

  // @Expose({ name: 'priceInfo', toPlainOnly: true })
  priceInfo: CalculatePriceInfo;

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
