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
    page: number = 1,
    limit: number = 10,
    relations?: string[],
    sort?: string,
  ): Promise<{ data: T[]; total: number; page: number; limit: number }> {
    const query = this.repository.createQueryBuilder(this.name);

    if (relations && relations.length > 0) {
      relations.forEach((relation) => {
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

    query.skip((page - 1) * limit).take(limit);

    const [data, total] = await query.getManyAndCount();

    return { data, total, page, limit };
  }

  async create(entity: Partial<T>): Promise<T> {
    return this.repository.save(entity as any);
  }

  async update(id: number, entity: Partial<T>): Promise<UpdateResult> {
    return this.repository.update(id, entity as any);
  }

  async findOne(id: number): Promise<T> {
    return this.repository.findOne({ where: { id } as any });
  }

  async delete(id: number): Promise<DeleteResult> {
    return this.repository.softDelete(id);
  }

  async restore(id: number): Promise<UpdateResult> {
    return this.repository.restore(id);
  }

  async findOrThrow(id: number): Promise<T> {
    const entity = await this.repository.findOne({ where: { id } as any });
    if (!entity) {
      throw new NotFoundException(
        `${this.name.charAt(0).toUpperCase() + this.name.slice(1)} not found`,
      );
    }
    return entity;
  }

  async findOrThrowByName(name: string): Promise<T> {
    const entity = await this.repository.findOne({ where: { name } as any });
    if (!entity) {
      throw new NotFoundException(
        `${this.name.charAt(0).toUpperCase() + this.name.slice(1)} not found`,
      );
    }
    return entity;
  }

  async findOrThrowByAttribute(attribute: Partial<T>): Promise<T> {
    const entity = await this.repository.findOne({ where: attribute as any });
    if (!entity) {
      throw new NotFoundException(
        `${this.name.charAt(0).toUpperCase() + this.name.slice(1)} not found`,
      );
    }
    return entity;
  }

  async throwIfFoundById(id: number) {
    const entity = await this.repository.findOne({ where: { id } as any });
    if (entity) {
      throw new ConflictException(
        `${this.name.charAt(0).toUpperCase() + this.name.slice(1)} already exists`,
      );
    }
  }

  async throwIfFoundByName(name: string) {
    const entity = await this.repository.findOne({ where: { name } as any });
    if (entity) {
      throw new ConflictException(
        `${this.name.charAt(0).toUpperCase() + this.name.slice(1)} already exists`,
      );
    }
  }

  async throwIfFoundByAnyAttribute(attributes: Partial<T>) {
    const conditions = Object.entries(attributes).map(([key, value]) => ({
      [key]: value,
    }));
    const entity = await this.repository.findOne({ where: conditions as any });
    if (entity) {
      throw new ConflictException(
        `${this.name.charAt(0).toUpperCase() + this.name.slice(1)} already exists`,
      );
    }
  }
}