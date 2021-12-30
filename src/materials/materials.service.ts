import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common-services.service';
import { FetchDataQuery } from 'src/common/fetch-data-query';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { Material } from './entities/material.entity';
import { MaterialRepository } from './repositories/material.reponsitory';

@Injectable()
export class MaterialsService extends CommonService<Material> {
  constructor(
    @InjectRepository(MaterialRepository)
    private readonly materialRepository: MaterialRepository,
  ) {
    super(materialRepository);
  }

  create(createMaterialDto: CreateMaterialDto) {
    const newMaterial = new Material(createMaterialDto.name);
    return newMaterial.save();
  }

  async findAllMaterial(query: FetchDataQuery): Promise<Material[]> {
    try {
      return await this.findAll(query);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async fetchAvailableMaterial(query: FetchDataQuery): Promise<Material[]> {
    return await this.findAvailable(query, {
      relations: ['products'],
      join: {
        alias: 'material',
        leftJoinAndSelect: {
          products: 'material.products',
        },
      },
    });
  }

  async update(
    id: string,
    updateMaterialDto: UpdateMaterialDto,
  ): Promise<Material> {
    const material = await this.materialRepository.findOne(id);

    if (!material) {
      throw new NotFoundException('Material not found!');
    }

    Object.entries(updateMaterialDto).forEach(([key, value]) => {
      material[key] = value;
    });

    await this.materialRepository.save(material);
    return this.materialRepository.findOne(id);
  }

  remove(id: string) {
    return `This action removes a #${id} material`;
  }
}
