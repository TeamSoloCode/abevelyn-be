import {
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
      throw new InternalServerErrorException(error.message);
    }
  }

  findAll() {
    return `This action returns all products`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
