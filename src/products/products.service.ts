import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CollectionRepository } from 'src/collections/repositories/collection.repository';
import { ColorRepository } from 'src/colors/repositories/color.repository';
import { ProductStatusRepository } from 'src/product-status/repositories/product-status.repository';
import { SizeRepository } from 'src/sizes/repositories/size.repository';
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

  async findAvailable(): Promise<Product[]> {
    try {
      return this.productRepository.find({
        where: { available: true, deleted: false },
        order: { sequence: 'DESC', createdAt: 'DESC' },
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll(): Promise<Product[]> {
    try {
      return await this.productRepository.find({
        where: { deleted: false },
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

      const {
        name,
        nameInFrench,
        nameInVietnames,
        description,
        descriptionInFrench,
        descriptionInVietnames,
        colorId,
        sizeId,
        statusId,
        image,
        image1,
        image2,
        image3,
        image4,
        image5,
      } = updateProductDto;

      product.name = name;
      product.nameInFrench = nameInFrench;
      product.nameInVietnamese = nameInVietnames;
      product.description = description;
      product.descriptionInFrench = descriptionInFrench;
      product.descriptionInVietnamese = descriptionInVietnames;
      product.color.uuid = colorId;
      product.size.uuid = sizeId;
      product.productStatus.uuid = statusId;
      product.image = image;
      product.image1 = image1;
      product.image2 = image2;
      product.image3 = image3;
      product.image4 = image4;
      product.image5 = image5;

      await this.productRepository.save(product);
      return await this.productRepository.findOne(product.uuid);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
