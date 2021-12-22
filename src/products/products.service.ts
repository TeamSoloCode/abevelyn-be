import {
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import _, { isNil } from 'lodash';
import { CollectionRepository } from 'src/collections/repositories/collection.repository';
import { ColorRepository } from 'src/colors/repositories/color.repository';
import { FetchDataQuery } from 'src/common/fetch-data-query';
import { ProductStatusRepository } from 'src/product-status/repositories/product-status.repository';
import { SizeRepository } from 'src/sizes/repositories/size.repository';
import { OrderArrayType } from 'src/utils';
import { In } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { ProductRepository } from './repositories/product.repository';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductRepository)
    private readonly productRepository: ProductRepository,
    @InjectRepository(ColorRepository)
    private readonly colorRepository: ColorRepository,
    @InjectRepository(SizeRepository)
    private readonly sizeRepository: SizeRepository,
    @InjectRepository(CollectionRepository)
    private readonly collectionRepository: CollectionRepository,
    @InjectRepository(ProductStatusRepository)
    private readonly productStatusRepository: ProductStatusRepository,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    try {
      const { colorId, sizeId, statusId, name, price, image, description } =
        createProductDto;

      const color = await this.colorRepository.findOne(colorId);
      if (!color) throw new NotFoundException('Color is not found');

      const size = await this.sizeRepository.findOne(sizeId);
      if (!size) throw new NotFoundException('Size is not found');

      const status = await this.productStatusRepository.findOne(statusId);
      if (!status) throw new NotFoundException('Status is not found');

      const product = new Product(
        name,
        image,
        description,
        price,
        color,
        status,
        size,
      );

      return await this.productRepository.save(product);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        // duplicate user
        throw new ConflictException('Product name is already existed!');
      } else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }

  async findAvailable(query: FetchDataQuery): Promise<Product[]> {
    const defaultCondition =
      'product.available = true AND product.deleted = false';

    const whereClause = query.cond
      ? `(${query.cond}) AND (${defaultCondition})`
      : defaultCondition;

    try {
      return await this.productRepository.find({
        relations: ['collections'],
        join: {
          alias: 'product',
          leftJoinAndSelect: {
            collections: 'product.collections',
          },
        },
        order: { ...query.order, sequence: 'DESC', createdAt: 'DESC' },
        where: whereClause,
        skip: query.offset,
        take: query.limit,
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findAll(): Promise<Product[]> {
    try {
      return await this.productRepository.find({
        where: '',
        order: { sequence: 'DESC', createdAt: 'DESC' },
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOne(id: string): Promise<Product> {
    try {
      const product = await this.productRepository.findOne(id);
      if (!product) throw new NotFoundException();
      return product;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    try {
      const product = await this.productRepository.findOne(id);

      if (!product) {
        throw new NotFoundException();
      }

      Object.entries(updateProductDto).forEach(([key, value]) => {
        product[key] = value;
      });

      const { sizeId, colorId, statusId } = updateProductDto;

      product.color.uuid = colorId;
      product.size.uuid = sizeId;
      product.productStatus.uuid = statusId;

      if (updateProductDto.colectionIds) {
        const collections = await this.collectionRepository.find({
          where: {
            uuid: In(
              typeof updateProductDto.colectionIds == 'string'
                ? updateProductDto.colectionIds.split(',')
                : updateProductDto.colectionIds,
            ),
          },
        });

        product.collections = collections;
      } else {
        product.collections = [];
      }

      await this.productRepository.save(product);
      return await this.productRepository.findOne({ uuid: product.uuid });
    } catch (error) {
      console.log('abcd', error);
      throw new InternalServerErrorException(error.message);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
