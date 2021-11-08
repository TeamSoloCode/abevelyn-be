import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductStatusDto } from './dto/create-product-status.dto';
import { UpdateProductStatusDto } from './dto/update-product-status.dto';
import { ProductStatus } from './entities/product-status.entity';
import { ProductStatusRepository } from './repositories/product-status.repository';

@Injectable()
export class ProductStatusService {
  constructor(
    @InjectRepository(ProductStatusRepository)
    private readonly productStatusRepository: ProductStatusRepository,
  ) {}

  async create(
    createProductStatusDto: CreateProductStatusDto,
  ): Promise<ProductStatus> {
    try {
      const productStatus = new ProductStatus(createProductStatusDto);
      return await this.productStatusRepository.save(productStatus);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        // duplicate user
        throw new ConflictException(['Status name is already exists!']);
      } else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }

  async findAll(): Promise<ProductStatus[]> {
    try {
      return await this.productStatusRepository.find();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOne(id: string): Promise<ProductStatus> {
    try {
      const productStatus = await this.productStatusRepository.findOne(id);
      if (!productStatus) throw new NotFoundException();
      return productStatus;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(
    id: string,
    updateProductStatusDto: UpdateProductStatusDto,
  ): Promise<ProductStatus> {
    try {
      const color = await this.productStatusRepository.findOne(id);

      if (!color) {
        throw new NotFoundException();
      }

      const { name, nameInFrench, nameInVietnames } = updateProductStatusDto;

      color.name = name;
      color.nameInFrench = nameInFrench;
      color.nameInVietnames = nameInVietnames;

      await this.productStatusRepository.save(color);
      return await this.productStatusRepository.findOne(color.uuid);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(id: string) {
    try {
      const productStatus = await this.productStatusRepository.findOne(id);

      if (!productStatus) {
        throw new NotFoundException();
      }

      await this.productStatusRepository.delete(id);
      return productStatus;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
