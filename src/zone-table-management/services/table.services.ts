import {
  Inject,
  forwardRef,
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Table } from '../entities/table.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { GenericService } from 'src/common/services/generic.service';
import { CreateTableDto } from '../dtos/table/create-table.dto';
import { ZoneService } from './zone.services';
import { UpdateTableDto } from '../dtos/table/update-table.dto';
import { Zone } from '../entities/zone.entity';

@Injectable()
export class TableService extends GenericService<Table> {
  constructor(
    @InjectDataSource() dataSource: DataSource,
    @InjectRepository(Table)
    private tableRepository: Repository<Table>,
    @Inject(forwardRef(() => ZoneService))
    private readonly zoneService: ZoneService,
  ) {
    super(dataSource, Table, 'table');
  }

  async createTable(tableDto: CreateTableDto) {
    await this.throwIfFoundByAnyAttribute({ tableCode: tableDto.tableCode });
    let tableData: any;
    if (tableDto.zoneUUID) {
      const zone = await this.zoneService.findOneByUUID(
        tableDto.zoneUUID,
        [],
        false,
        ['id'],
      );
      if (!zone) {
        throw new BadRequestException('Zone not found');
      }
      console.log(zone);
      tableData = { ...tableDto, zone: zone };
    }
    console.log(tableData);
    return this.tableRepository.save(tableData);
  }

  async updateTable(id: string, tableDto: UpdateTableDto) {
    const tableContent = await this.findOneByUUID(id, ['zone']);
    if (!tableContent) {
      throw new NotFoundException('Table not found');
    }

    if (tableDto.tableCode && tableDto.tableCode !== tableContent.tableCode) {
      await this.throwIfFoundByAnyAttribute({ tableCode: tableDto.tableCode });
    }

    let zone: Zone | null = tableContent.zone;
    console.log(zone);
    console.log(tableContent);
    if (tableDto.zoneUUID && tableDto.zoneUUID !== zone?.id) {
      console.log('dkhel lhna');
      zone = await this.zoneService.findOrThrowByAttribute({id: tableDto.zoneUUID});
    }

    const updateData = {
      ...(tableDto.tableCode && { tableCode: tableDto.tableCode }),
      ...(tableDto.tableName && { tableName: tableDto.tableName }),
      ...(tableDto.isActive && { isActive: tableDto.isActive }),
      zone,
    };

    return this.tableRepository.update(id, updateData);
  }

  async getTableByUUID(
    id: string,
    relations?: string[],
    withDeleted?: boolean,
  ) {
    const relationArray =
      typeof relations === 'string'
        ? (relations as string).split(',')
        : Array.isArray(relations)
          ? relations
          : [];
    const table = await this.findOneByUUID(id, relationArray, withDeleted);
    if (!table) {
      throw new NotFoundException('Table not found');
    }
    return table;
  }

  /* async customGet(id: string) {
    const table = await this.tableRepository
      .createQueryBuilder('table')
      .leftJoinAndSelect(
        'table.zone',
        'zone'
      )
      .where('table.id = :id', { id })
      .andWhere('table.deletedAt IS NULL')
      .setFindOptions({
        relations: {
          zone: true,
        },
        withDeleted: true
      })
      .getOne();

      if(!table){
        throw new NotFoundException('Table not found');
      }
      return table;
  } */

  async restoreTable(id: string) {
    if (!id) {
      return this.tableRepository.restore(id);
    }
  }
}
