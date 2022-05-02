import { EntityRepository, Repository } from 'typeorm';
import { Page } from '../entities/page.entity';

@EntityRepository(Page)
export class PageRepository extends Repository<Page> {}
