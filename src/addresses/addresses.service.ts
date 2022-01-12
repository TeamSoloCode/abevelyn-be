import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common-services.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Address } from './entities/address.entity';
import { AddressRepository } from './repositories/address.repository';

@Injectable()
export class AddressesService extends CommonService<Address> {
  constructor(
    @InjectRepository(AddressRepository)
    private readonly addressRepository: AddressRepository,
  ) {
    super(addressRepository);
  }

  create(createAddressDto: CreateAddressDto) {
    const {
      country,
      addressName,
      companyName,
      district,
      isDefaultAddress,
      postCode,
      provinceOrState,
      street,
    } = createAddressDto;

    const newAddress = new Address(country, provinceOrState, district, street);
    Object.assign(newAddress, {
      addressName,
      companyName,
      isDefaultAddress,
      postCode,
    });

    return this.addressRepository.save(newAddress);
  }

  update(id: number, updateAddressDto: UpdateAddressDto) {
    return `This action updates a #${id} address`;
  }

  remove(id: number) {
    return `This action removes a #${id} address`;
  }
}
