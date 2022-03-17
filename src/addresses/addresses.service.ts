import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { map } from 'lodash';
import { CommonService } from '../common/common-services.service';
import { User } from '../users/entities/user.entity';
import { In } from 'typeorm';
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

  async create(
    owner: User,
    createAddressDto: CreateAddressDto,
  ): Promise<Address> {
    const {
      country,
      addressName,
      companyName,
      district,
      isDefaultAddress = false,
      postCode,
      provinceOrState,
      street,
    } = createAddressDto;

    const addresses = await this.addressRepository.find({
      where: { owner: { uuid: owner.uuid } },
    });

    const newAddress = new Address(owner, street);
    if (addresses) {
      if (addresses.length >= 1) {
        newAddress.isDefaultAddress = isDefaultAddress;
        if (isDefaultAddress) {
          await this.addressRepository.update(
            { uuid: In(map(addresses, 'uuid')) },
            { isDefaultAddress: false },
          );
        }
      } else {
        newAddress.isDefaultAddress = true;
      }
    }

    Object.assign(newAddress, {
      country,
      addressName,
      companyName,
      district,
      postCode,
      provinceOrState,
      street,
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
