import { Max, Min } from 'class-validator';

export class CreateCollectionDto {
  @Max(256)
  @Min(10)
  name: string;

  @Min(10)
  description: string;
}
