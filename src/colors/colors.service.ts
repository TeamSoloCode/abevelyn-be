import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';
import { Color } from './entities/color.entity';
import { ColorRepository } from './repositories/color.repository';

@Injectable()
export class ColorsService {
  constructor(
    @InjectRepository(ColorRepository)
    private readonly colorRepository: ColorRepository,
  ) {}

  async create(createColorDto: CreateColorDto) {
    try {
      const product = new Color(createColorDto.name, createColorDto.code);
      return await this.colorRepository.save(product);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        // duplicate user
        throw new ConflictException(['Color name is already existed!']);
      } else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }

  async findAll(): Promise<Color[]> {
    try {
      return await this.colorRepository.find({
        where: { deleted: false },
        order: { sequence: 'DESC', createdAt: 'DESC' },
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAvailable(): Promise<Color[]> {
    try {
      return await this.colorRepository.find({
        where: { available: true, deleted: false },
        order: { sequence: 'DESC', createdAt: 'DESC' },
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOne(id: string): Promise<Color> {
    try {
      const color = await this.colorRepository.findOne(id);
      if (!color) throw new NotFoundException();
      return color;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: string, updateColorDto: UpdateColorDto): Promise<Color> {
    try {
      const color = await this.colorRepository.findOne(id);

      if (!color) {
        throw new NotFoundException();
      }

      const { name, nameInFrench, nameInVietnames, code } = updateColorDto;

      color.code = code;
      color.name = name;
      color.nameInFrench = nameInFrench;
      color.nameInVietnames = nameInVietnames;

      await this.colorRepository.save(color);
      return await this.colorRepository.findOne(color.uuid);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(id: string) {
    try {
      const color = await this.colorRepository.findOne(id);

      if (!color) {
        throw new NotFoundException();
      }

      color.deleted = true;
      await this.colorRepository.save(color);
      return this.colorRepository.findOne(id);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
