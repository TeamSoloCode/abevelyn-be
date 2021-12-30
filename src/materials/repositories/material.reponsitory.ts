import { EntityRepository, Repository } from 'typeorm';
import { Material } from '../entities/material.entity';

@EntityRepository(Material)
export class MaterialRepository extends Repository<Material> {}
