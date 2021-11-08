import { EntityRepository, Repository } from 'typeorm';
import { ProductStatus } from '../entities/product-status.entity';

@EntityRepository(ProductStatus)
export class ProductStatusRepository extends Repository<ProductStatus> {}
