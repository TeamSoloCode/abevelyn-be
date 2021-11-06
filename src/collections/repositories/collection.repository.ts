import { EntityRepository, Repository } from 'typeorm';
import { Collection } from '../entities/collection.entity';

@EntityRepository(Collection)
export class CollectionRepository extends Repository<Collection> {}
