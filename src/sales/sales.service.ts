import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CollectionRepository } from 'src/collections/repositories/collection.repository';
import { CommonService } from 'src/common/common-services.service';
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
    const newSale = new Sale(
      createSaleDto.saleOff,
      createSaleDto.startedDate,
      createSaleDto.expiredDate,
    );

    if (createSaleDto.maxOff) newSale.maxOff = createSaleDto.maxOff;
    if (createSaleDto.unit) newSale.unit = createSaleDto.unit;

    return this.saleRepository.save(newSale);
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

    Object.entries(updateSaleDto).forEach(([key, value]) => {
      sale[key] = value;
    });

    sale.collections = [];
    sale.products = [];

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

  remove(id: number) {
    return `This action removes a #${id} sale`;
  }
}
