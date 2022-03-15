import { Injectable } from '@nestjs/common';

@Injectable()
export class OrderHistoryService {
  findAll() {
    return `This action returns all productHistory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} productHistory`;
  }
}
