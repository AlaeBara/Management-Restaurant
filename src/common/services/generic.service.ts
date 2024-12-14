import {
  Injectable,
  NotFoundException,
  ConflictException,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { Repository, DeleteResult, UpdateResult, Table } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityTarget } from 'typeorm';
import FindOneOptions from '../interface/findoneoption.interface';
interface SearchQuery {
  [key: string]: string[];
}

@Injectable()
export class GenericService<T> {
  private repository: Repository<T>;
  private name: string;
  constructor(
    @InjectDataSource() protected readonly dataSource: DataSource,
    private readonly entity: EntityTarget<T>,
    modelName: string,
  ) {
    this.repository = this.dataSource.getRepository(this.entity);
    this.name = modelName.toLowerCase();
  }

  async splitByComma(input: string[] | string | undefined) {
    return typeof input === 'string'
      ? input.split(',')
      : Array.isArray(input)
        ? input
        : [];
  }



  async findAll(
    page?: number | string,
    limit?: number | string,
    relations?: string[],
    sort?: string,
    withDeleted: boolean = false,
    onlyDeleted: boolean = false,
    select?: string[],
    searchQuery?: Record<string, string | string[]>,
    FindBy?: Record<string, any>,
  ): Promise<{ data: T[]; total: number; page: number; limit: number }> {
    const query = this.repository.createQueryBuilder(this.name);

    if (FindBy) {
      query.where(FindBy);
    }

    if (searchQuery) {
      const searchCriteria: SearchQuery = {};
      Object.entries(searchQuery).forEach(([key, value]) => {
       if (key.startsWith('search.')) {
         const field = key.split('.')[1];
         const values = Array.isArray(value) ? value : [value];
         searchCriteria[field] = values;
       }
     });
      Object.entries(searchCriteria).forEach(([column, values], index) => {
       // Get the column metadata to check if it's an enum
       const columnMetadata = this.repository.metadata.findColumnWithPropertyPath(column);
       const isEnum = columnMetadata?.type === 'enum';
        const conditions = values.map((value, valueIndex) => {
         const paramName = `search${index}_${valueIndex}`;
         // Use exact matching for enums, ILIKE for text
         return isEnum 
           ? `${this.name}.${column} = :${paramName}`
           : `${this.name}.${column} ILIKE :${paramName}`;
       });
        query.andWhere(`(${conditions.join(' OR ')})`,
         values.reduce((params, value, valueIndex) => ({
           ...params,
           [`search${index}_${valueIndex}`]: isEnum ? value : `%${value}%`
         }), {})
       );
     });
    }

    const currentPage = Math.max(1, Number(page) || 1);
    const itemsPerPage = Math.max(1, Number(limit) || 10);

    const relationArray = await this.splitByComma(relations);

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

    if (!withDeleted && !onlyDeleted) {
      query.andWhere(`${this.name}.deletedAt IS NULL`);
    }

    if (onlyDeleted) {
      query.andWhere(`${this.name}.deletedAt IS NOT NULL`);
    }

    if (select) {
      const selectArray = await this.splitByComma(select);
      if (selectArray.length > 0) {
        const selectFields = ['id', ...selectArray];
        query.select(selectFields.map((field) => `${this.name}.${field}`));
      }
    }

    const [data, total] = await query.getManyAndCount();

    return { data, total, page: currentPage, limit: itemsPerPage };
  }

  async create(entity: Partial<T>): Promise<T> {
    return this.repository.save(entity as any);
  }

  async update(id: number | string, entity: Partial<T>): Promise<UpdateResult> {
    return this.repository.update(id, entity as any);
  }

  async findById(id: string | number) {
    return this.repository.findOne({ where: { id } as any });
  }

  async findOne(
    id: string | number,
    relations?: string[],
    withDeleted: boolean = false,
    select?: string[],
    onlyDeleted: boolean = false,
    findOrThrow: boolean = false,
  ): Promise<T> {
    const query = this.repository
      .createQueryBuilder(this.name)
      .where(`${this.name}.id = :id`, { id });

    query.withDeleted(); // include soft-deleted records in the query

    if (!withDeleted && !onlyDeleted) {
      query.andWhere(`${this.name}.deletedAt IS NULL`);
    }

    if (onlyDeleted) {
      query.andWhere(`${this.name}.deletedAt IS NOT NULL`);
    }

    if (relations) {
      const relationArray = await this.splitByComma(relations);
      if (relationArray && relationArray.length > 0) {
        relationArray.forEach((relation) => {
          query.leftJoinAndSelect(`${this.name}.${relation}`, relation);
        });
      }
    }

    if (select) {
      const selectArray = await this.splitByComma(select);
      if (selectArray && selectArray.length > 0) {
        const selectFields = ['id', ...selectArray];
        query.select(selectFields.map((field) => `${this.name}.${field}`));
      }
    }

    const entity = await query.getOne();

    if (findOrThrow) {
      if (!entity) {
        throw new NotFoundException(
          `${this.name.charAt(0).toUpperCase() + this.name.slice(1)} introuvable`,
        );
      }
    }

    return entity;
  }

  async findOneByIdWithOptions(
    id: string | number,
    options: Partial<FindOneOptions> = {},
  ): Promise<T> {
    const {
      relations = [],
      withDeleted = false,
      select = [],
      onlyDeleted = false,
      findOrThrow = true,
    } = options;

    const query = this.repository
      .createQueryBuilder(this.name)
      .where(`${this.name}.id = :id`, { id });

    query.withDeleted(); // include soft-deleted records in the query

    if (!withDeleted && !onlyDeleted) {
      query.andWhere(`${this.name}.deletedAt IS NULL`);
    }

    if (onlyDeleted) {
      query.andWhere(`${this.name}.deletedAt IS NOT NULL`);
    }

    if (relations) {
      const relationArray = await this.splitByComma(relations);
      if (relationArray && relationArray.length > 0) {
        relationArray.forEach((relation) => {
          query.leftJoinAndSelect(`${this.name}.${relation}`, relation);
        });
      }
    }

    if (select) {
      const selectArray = await this.splitByComma(select);
      if (selectArray && selectArray.length > 0) {
        const selectFields = ['id', ...selectArray];
        query.select(selectFields.map((field) => `${this.name}.${field}`));
      }
    }

    const entity = await query.getOne();

    if (findOrThrow) {
      if (!entity) {
        throw new NotFoundException(
          `${this.name.charAt(0).toUpperCase() + this.name.slice(1)} introuvable`,
        );
      }
    }

    return entity;
  }

  //
  async findOneWithoutBuilder(
    id: string | number,
    options: Partial<FindOneOptions> = {},
  ): Promise<T> {
    const {
      relations = [],
      withDeleted = false,
      select = [],
      onlyDeleted = false,
      findOrThrow = true,
    } = options;

    const relationArray = await this.splitByComma(relations);
    const selectArray = await this.splitByComma(select);

    const entity = await this.repository.findOne({
      where: { id } as any,
      relations: relationArray,
      select: selectArray.length > 0 ? ['id', ...selectArray] as any : undefined,
      withDeleted: true,
    });

    // Handle deleted records filtering
    if (entity && !withDeleted && !onlyDeleted && entity['deletedAt']) {
      throw new NotFoundException(
        `${this.name.charAt(0).toUpperCase() + this.name.slice(1)} introuvable`,
      );
    }

    if (entity && onlyDeleted && !entity['deletedAt']) {
      throw new NotFoundException(
        `${this.name.charAt(0).toUpperCase() + this.name.slice(1)} introuvable`,
      );
    }

    if (findOrThrow) {
      if (!entity) {
        throw new NotFoundException(
          `${this.name.charAt(0).toUpperCase() + this.name.slice(1)} introuvable`,
        );
      }
    }

    return entity;
  }

  async validateUnique(attributes: Partial<T>) {
    // Check each attribute individually
    for (const [key, value] of Object.entries(attributes)) {
      const count = await this.repository.count({
        where: { [key]: value } as any,
        withDeleted: false,
      });
  
      if (count > 0) {
        throw new ConflictException(
          `${this.name.charAt(0).toUpperCase() + this.name.slice(1)} avec ${key} "${value}" existe deja`
        );
      }
    }
  }

  async validateUniqueExcludingSelf(attributes: Partial<T>, excludeId?: number | string) {
    // Create query builder
    for (const [key, value] of Object.entries(attributes)) {
      const query = this.repository.createQueryBuilder(this.name);

      // Check for the specific attribute
      query.where(`${this.name}.${key} = :value`, { value });

      // Exclude the current entity if excludeId is provided
      if (excludeId) {
        query.andWhere(`${this.name}.id != :excludeId`, { excludeId });
      }

      const entity = await query.getCount();

      if (entity > 0) {
        throw new ConflictException(
          `${this.name.charAt(0).toUpperCase() + this.name.slice(1)} avec ${key} "${value}" existe deja`
        );
      }
    }
  }

  async findOrThrow(
    id: number,
    relations?: string[],
    withDeleted: boolean = false,
  ): Promise<T> {
    const relationArray = await this.splitByComma(relations);
    const entity = await this.repository.findOne({
      where: { id } as any,
      relations: relationArray,
      withDeleted: withDeleted,
    });
    if (!entity) {
      throw new NotFoundException(
        `${this.name.charAt(0).toUpperCase() + this.name.slice(1)} introuvable`,
      );
    }
    return entity;
  }

  async findOrThrowByUUID(
    id: string,
    relations?: string[],
    withDeleted: boolean = false,
  ): Promise<T> {
    const relationArray = await this.splitByComma(relations);

    const entity = await this.repository.findOne({
      where: { id } as any,
      relations: relationArray,
      withDeleted: withDeleted,
    });

    if (!entity) {
      throw new NotFoundException(
        `${this.name.charAt(0).toUpperCase() + this.name.slice(1)} introuvable`,
      );
    }
    return entity;
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

  /*   async findOneWithSoftDeletedRelations(
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
  } */

  async softDelete(id: number | string) {
    return this.repository.softDelete(id);
  }

  async forceDelete(id: number | string) {
    return this.repository.delete(id);
  }

  async restore(id: number): Promise<UpdateResult> {
    return this.repository.restore(id);
  }

  async restoreByUUID(
    id: string | number,
    checkUnique: boolean = false,
    listOfUniqueAttributes: string[] = [],
  ): Promise<UpdateResult> {
    const entity = (await this.findOneByIdWithOptions(id, {
      onlyDeleted: true,
    })) as any;

    if (entity && entity.deletedAt === null) {
      throw new ConflictException(
        `${this.name.charAt(0).toUpperCase() + this.name.slice(1)} n'est pas supprimé`,
      );
    }

    if (entity) {
      if (checkUnique && listOfUniqueAttributes.length > 0) {
        // Create an object with only the specified unique attributes
        /*    const uniqueAttributes = listOfUniqueAttributes.reduce((acc, attr) => {
             acc[attr] = entity[attr];
             return acc;
           }, {});
   
           console.log(uniqueAttributes);
   
           // Check if any active record exists with the same unique attributes
           const existingEntity = (await this.repository.findOne({
             where: uniqueAttributes as any,
             withDeleted: false,
           })) as any; */

        const conditions = listOfUniqueAttributes.map(attr => ({
          [attr]: entity[attr]
        }));

        // Check if any active record exists with any of the unique attributes
        const existingEntity = (await this.repository.findOne({
          where: conditions as any,
          withDeleted: false,
        })) as any;

        if (existingEntity && existingEntity.id === entity.id) {
          throw new ConflictException(
            `Ce ${this.name} n'est pas supprimé et ne peut etre restauré`,
          );
        } else if (existingEntity) {
          throw new ConflictException(
            `Un ${this.name} avec les mêmes attributs uniques existe deja`,
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

  async checkSelf(user: T, @Req() request: Request) {
    return (user as any).id === request['user'].sub
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
        `${this.name.charAt(0).toUpperCase() + this.name.slice(1)} introuvable`,
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
        `${this.name.charAt(0).toUpperCase() + this.name.slice(1)} introuvable`,
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
        `${this.name.charAt(0).toUpperCase() + this.name.slice(1)} existe deja`,
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
        `${this.name.charAt(0).toUpperCase() + this.name.slice(1)} existe deja`,
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
        `${this.name.charAt(0).toUpperCase() + this.name.slice(1)} existe deja`,
      );
    }
  }

  async findByAttributes(
    attributes: Partial<T>,
    relations?: string[],
    select?: string[],
    withDeleted: boolean = false,
  ): Promise<T> {
    const arrayRelations = await this.splitByComma(relations);
    const arraySelect = await this.splitByComma(select);
    const entity = await this.repository.findOne({
      where: attributes as any,
      relations: arrayRelations,
      withDeleted: withDeleted,
      select: arraySelect as any,
    });
    return entity;
  }
}
