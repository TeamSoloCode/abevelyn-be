import {
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import _, { isNil } from 'lodash';
import { CollectionRepository } from '../collections/repositories/collection.repository';
import { ColorRepository } from '../colors/repositories/color.repository';
import { CommonService } from '../common/common-services.service';
import { SaleType } from '../common/entity-enum';
import { FetchDataQuery } from '../common/fetch-data-query';
import { MaterialRepository } from '../materials/repositories/material.reponsitory';
import { ProductStatusRepository } from '../product-status/repositories/product-status.repository';
import { SaleRepository } from '../sales/repositories/sale.repository';
import { SizeRepository } from '../sizes/repositories/size.repository';
import { OrderArrayType } from '../utils';
import { In } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { ProductRepository } from './repositories/product.repository';

@Injectable()
export class ProductsService extends CommonService<Product> {
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
    @InjectRepository(MaterialRepository)
    private readonly materialRepository: MaterialRepository,
    @InjectRepository(SaleRepository)
    private readonly saleRepository: SaleRepository,
  ) {
    super(productRepository);
  }

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

  async findAvailableProduct(query: FetchDataQuery): Promise<Product[]> {
    return await this.findAvailable(query, {
      relations: ['collections', 'collections.sales', 'materials'],
      join: {
        alias: 'product',
        leftJoinAndSelect: {
          collections: 'product.collections',
          materials: 'product.materials',
          'collections.sales': 'collections.sales',
        },
      },
    });
  }

  async findAllProduct(query: FetchDataQuery): Promise<Product[]> {
    try {
      return await this.findAll(query);
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

      Object.assign(product, updateProductDto);

      const { sizeId, colorId, statusId } = updateProductDto;

      product.color.uuid = colorId;
      product.size.uuid = sizeId;
      product.productStatus.uuid = statusId;

      product.materials = [];
      product.collections = [];
      product.sales = [];

      if (updateProductDto.collectionIds) {
        const collections = await this.collectionRepository.find({
          where: {
            uuid: In(
              typeof updateProductDto.collectionIds == 'string'
                ? updateProductDto.collectionIds.split(',')
                : updateProductDto.collectionIds,
            ),
          },
        });

        product.collections = collections;
      }

      if (updateProductDto.materialIds) {
        const materials = await this.materialRepository.find({
          where: {
            uuid: In(
              typeof updateProductDto.materialIds == 'string'
                ? updateProductDto.materialIds.split(',')
                : updateProductDto.materialIds,
            ),
          },
        });

        product.materials = materials;
      }

      if (updateProductDto.saleIds) {
        const sales = await this.saleRepository.find({
          where: {
            uuid: In(
              typeof updateProductDto.saleIds == 'string'
                ? updateProductDto.saleIds.split(',')
                : updateProductDto.saleIds,
            ),
            saleType: SaleType.PRODUCT,
          },
        });

        product.sales = sales;
      }

      await this.productRepository.save(product);
      return await this.productRepository.findOne({
        where: { uuid: product.uuid },
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
