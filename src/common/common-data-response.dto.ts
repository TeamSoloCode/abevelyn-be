import { classToPlain, Expose } from 'class-transformer';
import { LanguageCode, UserRoles } from './entity-enum';

export default abstract class CommonDataResponse<T> {
  _language: LanguageCode;

  create1(
    data: any,
    language: LanguageCode = LanguageCode.ENGLISH,
    locale: string,
    dataResponseRole: UserRoles,
  ): any {
    const obj = {};

    Object.assign(obj, classToPlain(data));
    this._language = language;

    return classToPlain(<T>obj, {
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
