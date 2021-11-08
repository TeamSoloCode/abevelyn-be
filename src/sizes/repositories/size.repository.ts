import { EntityRepository, Repository } from 'typeorm';
import { Size } from '../entities/size.entity';

@EntityRepository(Size)
export class SizeRepository extends Repository<Size> {}
