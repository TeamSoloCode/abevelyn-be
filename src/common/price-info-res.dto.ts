import { classToPlain } from 'class-transformer';
import CommonDataResponse from '../common/common-data-response.dto';
import { LanguageCode, UserRoles } from '../common/entity-enum';

export class CartPriceResponseDTO extends CommonDataResponse<
  Partial<CartPriceResponseDTO>
> {
  totalPrice: number;
  totalSaleOffAsCurrency: number;
  totalSaleOffAsPercentage: number;
  calculatedPrice: number;

  public create(
    data: CartPriceResponseDTO,
    language: LanguageCode,
    locale: string,
    dataResponseRole: UserRoles,
  ): Partial<CartPriceResponseDTO> {
    const obj: CartPriceResponseDTO = Object.create(
      CartPriceResponseDTO.prototype,
    );

    Object.assign(obj, classToPlain(data));

    obj._language = language;

    return classToPlain(obj, {
      excludePrefixes: ['_'],
      groups: [dataResponseRole],
    });
  }
}
