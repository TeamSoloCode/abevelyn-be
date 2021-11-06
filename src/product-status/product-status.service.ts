import { Injectable } from '@nestjs/common';
import { CreateProductStatusDto } from './dto/create-product-status.dto';
import { UpdateProductStatusDto } from './dto/update-product-status.dto';

@Injectable()
export class ProductStatusService {
  create(createProductStatusDto: CreateProductStatusDto) {
    return 'This action adds a new productStatus';
  }

  findAll() {
    return `This action returns all productStatus`;
  }

  findOne(id: number) {
    return `This action returns a #${id} productStatus`;
  }

  update(id: number, updateProductStatusDto: UpdateProductStatusDto) {
    return `This action updates a #${id} productStatus`;
  }

  remove(id: number) {
    return `This action removes a #${id} productStatus`;
  }
}
