import { classToPlain, Exclude, Expose } from 'class-transformer';
import { CartItem } from 'src/cart-item/entities/cart-item.entity';
import CommonDataResponse from 'src/common/common-data-response.dto';
import { LanguageCode, UserRoles } from 'src/common/entity-enum';
import { User } from 'src/users/entities/user.entity';

export class CartDataResponse extends CommonDataResponse<
  Partial<CartDataResponse>
> {
  uuid: string;
  createdAt: Date;

  @Exclude()
  owner: User;

  cartItems: CartItem[];

  @Expose({ groups: [UserRoles.ADMIN] })
  updatedAt: Date;

  public create(
    data: CartDataResponse,
    language: LanguageCode,
    locale: string,
    dataResponseRole: UserRoles,
  ): Partial<CartDataResponse> {
    const obj: CartDataResponse = Object.create(CartDataResponse.prototype);

    Object.assign(obj, classToPlain(data));

    obj._language = language;

    return classToPlain(obj, {
      excludePrefixes: ['_'],
      groups: [dataResponseRole],
    });
  }
}
