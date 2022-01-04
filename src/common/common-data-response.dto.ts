import { classToPlain, Expose } from 'class-transformer';
import { DTOKeyPrototypeMapper } from 'src/utils';
import { LanguageCode, UserRoles } from './entity-enum';

export default abstract class CommonDataResponse<T> {
  _language: LanguageCode;
  static DTO_KEY = Symbol('dtoKey');

  protected serializeDataResponse(
    obj: CommonDataResponse<T>,
    data: T,
    language: LanguageCode,
    locale: string,
    dataResponseRole: UserRoles,
  ) {
    obj._language = language;

    Object.keys(data).forEach((key) => {
      const dtoMetadata = Reflect.getMetadata(
        CommonDataResponse.DTO_KEY,
        obj,
        key,
      );

      const createObject = (value, language, locale, dataResponseRole) =>
        Object.create(DTOKeyPrototypeMapper[dtoMetadata]).create(
          value,
          language,
          locale,
          dataResponseRole,
        );

      if (dtoMetadata) {
        if (!data[key]) return;
        if (data[key] instanceof Array) {
          data[key] = data[key].map((value) => {
            return createObject(value, language, locale, dataResponseRole);
          });
        } else {
          data[key] = createObject(
            data[key],
            language,
            locale,
            dataResponseRole,
          );
        }
      }
    });

    Object.assign(obj, classToPlain(data));

    return classToPlain(obj, {
      excludePrefixes: ['_'],
      groups: [dataResponseRole],
    });
  }

  public abstract create(
    data: any,
    language: LanguageCode,
    locale: string,
    dataResponseRole: UserRoles,
  ): T;
}
