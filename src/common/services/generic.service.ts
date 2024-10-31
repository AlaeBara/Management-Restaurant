import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Repository, DeleteResult, UpdateResult } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityTarget } from 'typeorm';

@Injectable()
export class GenericService<T> {
  private repository: Repository<T>;
  private name: string;
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    private entity: EntityTarget<T>,
    modelName: string,
  ) {
    this.repository = this.dataSource.getRepository(this.entity);
    this.name = modelName.toLowerCase();
  }

  async findAll(
    page?: number | string,
    limit?: number | string,
    relations?: string[],
    sort?: string,
    withDeleted: boolean = false,
  ): Promise<{ data: T[]; total: number; page: number; limit: number }> {
    const query = this.repository.createQueryBuilder(this.name);

    const currentPage = Math.max(1, Number(page) || 1);
    const itemsPerPage = Math.max(1, Number(limit) || 10);

    const relationArray =
      typeof relations === 'string'
        ? (relations as string).split(',')
        : Array.isArray(relations)
          ? relations
          : [];

    if (relationArray && relationArray.length > 0) {
      relationArray.forEach((relation) => {
        query.leftJoinAndSelect(`${this.name}.${relation}`, relation);
      });
    }

    if (sort) {
      const [field, order] = sort.split(':');
      query.orderBy(
        `${this.name}.${field}`,
        order.toUpperCase() as 'ASC' | 'DESC',
      );
    } else {
      query.orderBy(`${this.name}.id`, 'ASC');
    }

    query
      .skip((currentPage - 1) * itemsPerPage)
      .take(itemsPerPage)
      .setFindOptions({
        relations: relationArray?.reduce(
          (acc, rel) => ({ ...acc, [rel]: true }),
          {},
        ),
        withDeleted: true,
      });

    if (!withDeleted) {
      query.andWhere(`${this.name}.deletedAt IS NULL`);
    }

    const [data, total] = await query.getManyAndCount();

    return { data, total, page: currentPage, limit: itemsPerPage };
  }

  async create(entity: Partial<T>): Promise<T> {
    return this.repository.save(entity as any);
  }

  async update(id: number, entity: Partial<T>): Promise<UpdateResult> {
    return this.repository.update(id, entity as any);
  }

  async updateByUUID(id: string, entity: Partial<T>): Promise<UpdateResult> {
    return this.repository.update(id, entity as any);
  }

  async findOne(
    id: number,
    relations?: string[],
    withDeleted: boolean = false,
  ): Promise<T> {
    return this.repository.findOne({
      where: { id } as any,
      relations: relations,
      withDeleted: withDeleted,
    });
  }

  async findOneByUUID(
    id: string,
    relations?: string[],
    withDeleted: boolean = false,
    select?: string[],
  ): Promise<T> {
    return this.repository.findOne({
      where: { id } as any,
      relations: relations,
      withDeleted: withDeleted,
      select: select as any,
    });
  }

  /* async customGet(id: string, relations?: string[], withDeleted: boolean = false) {
    const query = this.repository
      .createQueryBuilder(this.name)
      .where(`${this.name}.id = :id`, { id })
      
      if(withDeleted){
        query.andWhere(`${this.name}.deletedAt IS NULL`);
      }
    // Handle relations if provided
    if (relations && relations.length > 0) {
      relations.forEach(relation => {
        query.leftJoinAndSelect(`${this.name}.${relation}`, relation).withDeleted();
      });
    }

    return query.getOne();
  } */

  async findOneWithSoftDeletedRelations(
    id: string,
    relations?: string[],
    withDeleted: boolean = false,
  ) {
    const query = this.repository
      .createQueryBuilder(this.name)
      .where(`${this.name}.id = :id`, { id });
    if (!withDeleted) {
      query.andWhere(`${this.name}.deletedAt IS NULL`);
    }

    // Handle relations if provided
    if (relations && relations.length > 0) {
      relations.forEach((relation) => {
        query.leftJoinAndSelect(`${this.name}.${relation}`, relation);
      });
    }

    const result = await query
      .setFindOptions({
        relations: relations?.reduce(
          (acc, rel) => ({ ...acc, [rel]: true }),
          {},
        ),
        withDeleted: true,
      })
      .getOne();
    return result;
  }

  async delete(id: number): Promise<DeleteResult> {
    return this.repository.softDelete(id);
  }

  async deleteByUUID(id: string): Promise<DeleteResult> {
    return this.repository.softDelete(id);
  }

  async restore(id: number): Promise<UpdateResult> {
    return this.repository.restore(id);
  }

  async restoreByUUID(
    id: string,
    checkUnique: boolean = false,
    listOfUniqueAttributes: string[] = [],
  ): Promise<UpdateResult> {
    const entity = await this.findOneByUUID(id, undefined, true);
    if (entity) {
      if (checkUnique && listOfUniqueAttributes.length > 0) {
        // Create an object with only the specified unique attributes
        const uniqueAttributes = listOfUniqueAttributes.reduce((acc, attr) => {
          acc[attr] = entity[attr];
          return acc;
        }, {});

        // Check if any active record exists with the same unique attributes
        const existingEntity = await this.repository.findOne({
          where: uniqueAttributes as any,
          withDeleted: false,
        });

        if (existingEntity) {
          throw new ConflictException(
            `Active ${this.name} with the same unique attributes already exists`,
          );
        }
      }
    }

    return this.repository.restore(id);
  }

  async countByAttribute(attribute: Partial<T> | Record<string, any>) {
    // For nested relations, we need to use QueryBuilder
    const query = this.repository.createQueryBuilder(this.name);

    // Process each attribute
    Object.entries(attribute).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        // Handle relation
        query.andWhere(`${this.name}.${key} = :${key}Id`, {
          [`${key}Id`]: value.id,
        });
      } else {
        // Handle regular attribute
        query.andWhere(`${this.name}.${key} = :${key}`, { [key]: value });
      }
    });

    return query.getCount();
  }

  async findOrThrow(
    id: number,
    relations?: string[],
    withDeleted: boolean = false,
  ): Promise<T> {
    const entity = await this.repository.findOne({
      where: { id } as any,
      relations: relations,
      withDeleted: withDeleted,
    });
    if (!entity) {
      throw new NotFoundException(
        `${this.name.charAt(0).toUpperCase() + this.name.slice(1)} not found`,
      );
    }
    return entity;
  }

  async findOrThrowByUUID(
    id: string,
    relations?: string[],
    withDeleted: boolean = false,
  ): Promise<T> {
    const relationArray =
      typeof relations === 'string'
        ? (relations as string).split(',')
        : Array.isArray(relations)
          ? relations
          : [];
    const entity = await this.repository.findOne({
      where: { id } as any,
      relations: relationArray,
      withDeleted: withDeleted,
    });

    if (!entity) {
      throw new NotFoundException(
        `${this.name.charAt(0).toUpperCase() + this.name.slice(1)} not found`,
      );
    }
    return entity;
  }

  async findOrThrowByName(
    name: string,
    relations?: string[],
    withDeleted: boolean = false,
  ): Promise<T> {
    const entity = await this.repository.findOne({
      where: { name } as any,
      relations: relations,
      withDeleted: withDeleted,
    });
    if (!entity) {
      throw new NotFoundException(
        `${this.name.charAt(0).toUpperCase() + this.name.slice(1)} not found`,
      );
    }
    return entity;
  }

  async findOrThrowByAttribute(
    attribute: Partial<T>,
    relations?: string[],
    withDeleted: boolean = false,
  ): Promise<T> {
    const entity = await this.repository.findOne({
      where: attribute as any,
      relations: relations,
      withDeleted: withDeleted,
    });
    if (!entity) {
      throw new NotFoundException(
        `${this.name.charAt(0).toUpperCase() + this.name.slice(1)} not found`,
      );
    }
    return entity;
  }

  async throwIfFoundById(
    id: number,
    relations?: string[],
    withDeleted: boolean = false,
  ) {
    const entity = await this.repository.findOne({
      where: { id } as any,
      relations: relations,
      withDeleted: withDeleted,
    });
    if (entity) {
      throw new ConflictException(
        `${this.name.charAt(0).toUpperCase() + this.name.slice(1)} already exists`,
      );
    }
  }

  async throwIfFoundByName(
    name: string,
    relations?: string[],
    withDeleted: boolean = false,
  ) {
    const entity = await this.repository.findOne({
      where: { name } as any,
      relations: relations,
      withDeleted: withDeleted,
    });
    if (entity) {
      throw new ConflictException(
        `${this.name.charAt(0).toUpperCase() + this.name.slice(1)} already exists`,
      );
    }
  }

  async throwIfFoundByAnyAttribute(
    attributes: Partial<T>,
    relations?: string[],
    withDeleted: boolean = false,
  ) {
    const conditions = Object.entries(attributes).map(([key, value]) => ({
      [key]: value,
    }));
    const entity = await this.repository.findOne({
      where: conditions as any,
      relations: relations,
      withDeleted: withDeleted,
    });
    if (entity) {
      throw new ConflictException(
        `${this.name.charAt(0).toUpperCase() + this.name.slice(1)} already exists`,
      );
    }
  }

  async findByAttributes(
    attributes: Partial<T>,
    relations?: string[],
    select?: string[],
    withDeleted: boolean = false,
  ): Promise<T> {
    const entity = await this.repository.findOne({
      where: attributes as any,
      relations: relations,
      withDeleted: withDeleted,
      select: select as any,
    });
    return entity;
  }
}
