import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CollectionRepository } from 'src/collections/repositories/collection.repository';
import { CommonService } from 'src/common/common-services.service';
import { SaleType } from 'src/common/entity-enum';
import { FetchDataQuery } from 'src/common/fetch-data-query';
import { ProductRepository } from 'src/products/repositories/product.repository';
import { In } from 'typeorm';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { Sale } from './entities/sale.entity';
import { SaleRepository } from './repositories/sale.repository';

@Injectable()
export class SalesService extends CommonService<Sale> {
  constructor(
    @InjectRepository(SaleRepository)
    private readonly saleRepository: SaleRepository,
    @InjectRepository(CollectionRepository)
    private readonly collectionRepository: CollectionRepository,
    @InjectRepository(ProductRepository)
    private readonly productRepository: ProductRepository,
  ) {
    super(saleRepository);
  }

  create(createSaleDto: CreateSaleDto) {
    const {
      saleOff,
      unit,
      startedDate,
      expiredDate,
      saleType,
      applyPrice,
      name,
      maxOff,
    } = createSaleDto;

    const newSale = new Sale(saleOff, startedDate, expiredDate, saleType);

    if (saleType === SaleType.ORDER) {
      newSale.applyPrice = applyPrice;
    }

    newSale.unit = unit;
    newSale.name = name;
    newSale.maxOff = maxOff;
    try {
      return this.saleRepository.save(newSale);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        // duplicate user
        throw new ConflictException(['Username already exists!']);
      } else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }

  findAllSale(query: FetchDataQuery): Promise<Sale[]> {
    return this.findAll(query);
  }

  async findAvailableSale(query: FetchDataQuery): Promise<Sale[]> {
    return this.findAvailable(query);
  }

  async update(id: string, updateSaleDto: UpdateSaleDto) {
    const sale = await this.saleRepository.findOne(id);
    if (!sale) {
      throw new NotFoundException('Sale not found!');
    }

    Object.assign(sale, updateSaleDto);

    sale.collections = sale.collections;
    sale.products = sale.products;

    if (updateSaleDto.collectionIds) {
      const collections = await this.collectionRepository.find({
        where: {
          uuid: In(updateSaleDto.collectionIds),
        },
      });

      sale.collections = collections;
    }

    if (updateSaleDto.productIds) {
      const products = await this.productRepository.find({
        where: {
          uuid: In(updateSaleDto.productIds),
        },
      });

      sale.products = products;
    }

    await this.saleRepository.save(sale);
    return this.saleRepository.findOne(id);
  }
}
