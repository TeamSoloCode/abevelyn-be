import { classToPlain, Expose } from 'class-transformer';
import { LanguageCode, UserRoles } from './entity-enum';

export default abstract class CommonDataResponse<T> {
  _language: LanguageCode;

  public abstract create(
    data: any,
    language: LanguageCode,
    locale: string,
    dataResponseRole: UserRoles,
  ): T;
}
