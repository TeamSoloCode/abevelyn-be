import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSizeDto } from './dto/create-size.dto';
import { UpdateSizeDto } from './dto/update-size.dto';
import { Size } from './entities/size.entity';
import { SizeRepository } from './repositories/size.repository';

@Injectable()
export class SizesService {
  constructor(
    @InjectRepository(SizeRepository)
    private readonly sizeRepository: SizeRepository,
  ) {}

  async create(createSizeDto: CreateSizeDto): Promise<Size> {
    try {
      const size = new Size(createSizeDto.name);
      return await this.sizeRepository.save(size);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        // duplicate user
        throw new ConflictException(['Size name is already existed!']);
      } else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }

  async findAll(): Promise<Size[]> {
    try {
      return await this.sizeRepository.find();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOne(id: string): Promise<Size> {
    try {
      const size = await this.sizeRepository.findOne(id);
      if (!size) throw new NotFoundException();
      return size;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: string, updateSizeDto: UpdateSizeDto): Promise<Size> {
    try {
      const size = await this.sizeRepository.findOne(id);

      if (!size) {
        throw new NotFoundException();
      }

      const { name, nameInFrench, nameInVietnames } = updateSizeDto;

      size.name = name;
      size.nameInFrench = nameInFrench;
      size.nameInVietnames = nameInVietnames;

      await this.sizeRepository.save(size);
      return await this.sizeRepository.findOne(size.uuid);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(id: string): Promise<Size> {
    try {
      const size = await this.sizeRepository.findOne(id);

      if (!size) {
        throw new NotFoundException();
      }

      await this.sizeRepository.delete(id);
      return size;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
