import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/products/entities/product.entity';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { Collection } from './entities/collection.entity';
import { CollectionRepository } from './repositories/collection.repository';

@Injectable()
export class CollectionsService {
  constructor(
    @InjectRepository(CollectionRepository)
    private readonly collectionRepository: CollectionRepository,
  ) {}

  async create(createCollectionDto: CreateCollectionDto) {
    try {
      const product = new Collection(createCollectionDto);
      return await this.collectionRepository.save(product);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        // duplicate user
        throw new ConflictException(['Collection name is already exists!']);
      } else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }

  findAll() {
    return this.collectionRepository.find();
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
