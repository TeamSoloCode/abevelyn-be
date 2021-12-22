import { Injectable } from '@nestjs/common';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';

@Injectable()
export class MaterialsService {
  create(createMaterialDto: CreateMaterialDto) {
    return 'This action adds a new material';
  }

  findAll() {
    return `This action returns all materials`;
  }

  findOne(id: string) {
    return `This action returns a #${id} material`;
  }

  update(id: string, updateMaterialDto: UpdateMaterialDto) {
    return `This action updates a #${id} material`;
  }

  remove(id: string) {
    return `This action removes a #${id} material`;
  }

  abcd() {
    return `This action removes a  abcd`;
  }
}
