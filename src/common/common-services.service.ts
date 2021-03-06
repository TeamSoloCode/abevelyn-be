import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Product } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';
import {
  FindManyOptions,
  FindOneOptions,
  JoinOptions,
  Repository,
} from 'typeorm';
import { EntityFieldsNames } from 'typeorm/common/EntityFieldsNames';
import { FetchDataQuery } from './fetch-data-query';

export class CommonService<T> {
  constructor(repository: Repository<T>) {
    this.repository = repository;
  }

  private repository: Repository<T>;

  private getFindOptions(
    whereClause: string,
    order?: { [P in EntityFieldsNames<T>]?: 'ASC' | 'DESC' | 1 | -1 },
    findOptions: FindManyOptions<T> = {},
    offset: number = 0,
    limit: number = 100,
  ): FindManyOptions<T> | FindOneOptions<T> {
    return {
      order: <any>{
        ...order,
        sequence: 'DESC',
        createdAt: 'DESC',
      },
      where: whereClause,
      skip: offset,
      take: limit,
      ...findOptions,
    };
  }

  protected async findAvailable(
    query: FetchDataQuery = {},
    findOptions: FindManyOptions<T> = {},
  ): Promise<T[]> {
    const mainJoinAlias = findOptions?.join?.alias;
    let defaultCondition = 'available = true AND deleted = false';

    if (mainJoinAlias) {
      defaultCondition = `${mainJoinAlias}.available = true AND ${mainJoinAlias}.deleted = false`;
    }

    const whereClause = query.cond
      ? `(${query.cond}) AND (${defaultCondition})`
      : defaultCondition;

    try {
      return await this.repository.find(
        this.getFindOptions(
          whereClause,
          query.order,
          findOptions,
          query.offset,
          query.limit,
        ),
      );
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  protected async findOneAvailable(
    query: FetchDataQuery = {},
    findOptions: FindManyOptions<T> = {},
  ): Promise<T> {
    const mainJoinAlias = findOptions?.join?.alias;
    let defaultCondition = 'available = true AND deleted = false';

    if (mainJoinAlias) {
      defaultCondition = `${mainJoinAlias}.available = true AND ${mainJoinAlias}.deleted = false`;
    }

    const whereClause = query.cond
      ? `(${query.cond}) AND (${defaultCondition})`
      : defaultCondition;

    try {
      return await this.repository.findOne(
        this.getFindOptions(
          whereClause,
          query.order,
          findOptions,
          query.offset,
          query.limit,
        ),
      );
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  protected async search(
    query: FetchDataQuery = {},
    findOptions: FindManyOptions<T> = {},
  ): Promise<T[]> {
    try {
      return await this.repository.find(
        this.getFindOptions(
          query.cond,
          query.order,
          findOptions,
          query.offset,
          query.limit,
        ),
      );
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll(
    query: FetchDataQuery = {},
    findOptions: FindManyOptions<T> = {},
  ): Promise<T[]> {
    try {
      return await this.repository.find(
        this.getFindOptions(
          query.cond,
          query.order,
          findOptions,
          query.offset,
          query.limit,
        ),
      );
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOne(
    id: string,
    owner?: User,
    findOptions: FindManyOptions<T> = {},
  ): Promise<T> {
    const ownerFind = owner ? { owner: { uuid: owner.uuid } } : {};
    const data = await this.repository.findOne(
      <any>{
        uuid: id,
        ...ownerFind,
      },
      { ...findOptions },
    );
    if (!data) throw new NotFoundException();
    return data;
  }
}
