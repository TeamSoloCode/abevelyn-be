import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { SaleType } from 'src/common/entity-enum';
import { SaleRepository } from 'src/sales/repositories/sale.repository';
import { In } from 'typeorm';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { Collection } from './entities/collection.entity';
import { CollectionRepository } from './repositories/collection.repository';
import { CommonService } from '../common/common-services.service';
import { FetchDataQuery } from 'src/common/fetch-data-query';
import { validate } from 'class-validator';

@Injectable()
export class CollectionsService extends CommonService<Collection> {
  constructor(
    @InjectRepository(CollectionRepository)
    private readonly collectionRepository: CollectionRepository,
    @InjectRepository(SaleRepository)
    private readonly saleRepository: SaleRepository,
  ) {
    super(collectionRepository);
  }

  async create(createCollectionDto: CreateCollectionDto): Promise<Collection> {
    try {
      const product = new Collection(createCollectionDto.name);
      if (createCollectionDto.image) product.image = createCollectionDto.image;
      return await this.collectionRepository.save(product);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        // duplicate Collection
        throw new ConflictException(['Collection name is already existed!']);
      } else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }

  async findAvailableCollection(query: FetchDataQuery): Promise<Collection[]> {
    try {
      return await this.findAvailable(query, {
        join: {
          alias: 'collection',
        },
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

      Object.entries(updateCollectionDto).forEach(([key, value]) => {
        collection[key] = value;
      });

      collection.sales = collection.sales;

      if (updateCollectionDto.saleIds) {
        const sales = await this.saleRepository.find({
          where: {
            uuid: In(
              typeof updateCollectionDto.saleIds == 'string'
                ? updateCollectionDto.saleIds.split(',')
                : updateCollectionDto.saleIds,
            ),
            saleType: SaleType.COLLECTION,
          },
        });

        collection.sales = sales;
      }

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
