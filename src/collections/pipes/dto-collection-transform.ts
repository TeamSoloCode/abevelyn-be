import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class MultipartTransformPipe
  implements PipeTransform<{ data: string }, any>
{
  transform(value: { data: string }, metadata: ArgumentMetadata) {
    const result: any = value?.data ? JSON.parse(value?.data) : {};
    return result;
  }
}
