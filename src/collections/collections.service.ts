import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { CollectionRepository } from './repositories/collection.repository';

@Injectable()
export class CollectionsService {
  constructor(
    @InjectRepository(CollectionRepository)
    private readonly collectionRepository: CollectionRepository,
  ) {}

  create(createCollectionDto: CreateCollectionDto) {}

  findAll() {
    return `This action returns all collections`;
  }

  findOne(id: number) {
    return `This action returns a #${id} collection`;
  }

  update(id: number, updateCollectionDto: UpdateCollectionDto) {
    return `This action updates a #${id} collection`;
  }

  remove(id: number) {
    return `This action removes a #${id} collection`;
  }
}
