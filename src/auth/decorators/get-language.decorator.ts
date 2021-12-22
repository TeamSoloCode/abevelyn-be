import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { LanguageCode } from 'src/common/entity-enum';
import { User } from '../../users/entities/user.entity';

export class HeaderInfo {
  language: LanguageCode;
  locale?: string;
}

export const GetHeaderInfo = createParamDecorator(
  (data, ctx: ExecutionContext): HeaderInfo => {
    const request = ctx.switchToHttp().getRequest();
    const language = request.get('language');
    const locale = request.get('locale');
    return { language, locale };
  },
);
