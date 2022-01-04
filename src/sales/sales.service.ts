import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common-services.service';
import { FetchDataQuery } from 'src/common/fetch-data-query';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { Sale } from './entities/sale.entity';
import { SaleRepository } from './repositories/sale.repository';

@Injectable()
export class SalesService extends CommonService<Sale> {
  constructor(
    @InjectRepository(SaleRepository)
    private readonly saleRepository: SaleRepository,
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

  update(id: number, updateSaleDto: UpdateSaleDto) {
    return `This action updates a #${id} sale`;
  }

  remove(id: number) {
    return `This action removes a #${id} sale`;
  }
}
