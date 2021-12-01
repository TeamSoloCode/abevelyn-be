import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundError } from 'rxjs';
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

  async create(createCollectionDto: CreateCollectionDto): Promise<Collection> {
    try {
      const product = new Collection(
        createCollectionDto.name,
        createCollectionDto.available,
      );
      return await this.collectionRepository.save(product);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        // duplicate user
        throw new ConflictException(['Collection name is already existed!']);
      } else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }

  async findAll(): Promise<Collection[]> {
    try {
      return await this.collectionRepository.find({
        where: { deleted: false },
        order: { sequence: 'DESC', createdAt: 'DESC' },
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAvailableCollection(): Promise<Collection[]> {
    try {
      return await this.collectionRepository.find({
        where: { available: true, deleted: false },
        order: { sequence: 'DESC', createdAt: 'DESC' },
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOne(id: string) {
    try {
      return await this.collectionRepository.findOne(id);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: string, updateCollectionDto: UpdateCollectionDto) {
    try {
      const collection = await this.collectionRepository.findOne(id);

      if (!collection) {
        throw new NotFoundException();
      }

      const {
        available,
        name,
        nameInFrench,
        nameInVietnames,
        description,
        descriptionInFrench,
        descriptionInVietnames,
      } = updateCollectionDto;

      collection.available = available;
      collection.name = name;
      collection.nameInFrench = nameInFrench;
      collection.nameInVietnames = nameInVietnames;
      collection.description = description;
      collection.descriptionInFrench = descriptionInFrench;
      collection.descriptionInVietnames = descriptionInVietnames;

      await this.collectionRepository.save(collection);
      return await this.collectionRepository.findOne(collection.uuid);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(id: string) {
    try {
      const collection = await this.collectionRepository.findOne(id);

      if (!collection) {
        throw new NotFoundException();
      }
      collection.deleted = true;
      await this.collectionRepository.save(collection);
      return await this.collectionRepository.findOne(collection.uuid);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
