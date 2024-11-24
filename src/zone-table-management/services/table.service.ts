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
import { ZoneService } from './zone.service';
import { UpdateTableDto } from '../dtos/table/update-table.dto';
import { Zone } from '../entities/zone.entity';
import QrcodeService from 'src/qr-code/services/qrcode.service';
import { TableStatus } from '../enums/table-status.enum';

@Injectable()
export class TableService extends GenericService<Table> {
  constructor(
    @InjectDataSource() dataSource: DataSource,
    @InjectRepository(Table)
    private tableRepository: Repository<Table>,
    @Inject(forwardRef(() => ZoneService))
    private readonly zoneService: ZoneService,
    private readonly qrcodeService: QrcodeService,
  ) {
    super(dataSource, Table, 'table');
  }

  async createTable(tableDto: CreateTableDto) {
    await this.throwIfFoundByAnyAttribute({ tableCode: tableDto.tableCode });
    let tableData: any;
    if (tableDto.zoneUUID) {
      const zone = await this.zoneService.findOne(
        tableDto.zoneUUID,
        [],
        false,
        ['id'],
      );
      if (!zone) {
        throw new BadRequestException('Zone not found');
      }

      tableData = { ...tableDto, zone: zone };
    }

    const savedTable = await this.tableRepository.save(tableData);
    const qrcode = await this.qrcodeService.generateQrCode(
      process.env.MENU_WITH_QRCODE_URL + savedTable.id,
    );
    savedTable.qrcode = qrcode;
    return await this.tableRepository.save(savedTable);
  }

  async updateTable(id: string, tableDto: UpdateTableDto) {
    const tableContent = await this.findOne(id, ['zone']);
    if (!tableContent) {
      throw new NotFoundException('Table not found');
    }

    if (tableDto.tableCode && tableDto.tableCode !== tableContent.tableCode) {
      await this.throwIfFoundByAnyAttribute({ tableCode: tableDto.tableCode });
    }

    let zone: Zone | null = tableContent.zone;

    if (tableDto.zoneUUID && tableDto.zoneUUID !== zone?.id) {
      zone = await this.zoneService.findOrThrowByAttribute({
        id: tableDto.zoneUUID,
      });
      tableContent.zone = zone;
    }

    Object.assign(tableContent, tableDto);
  
    return this.tableRepository.save(tableContent);
  }
  /* 
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
  } */

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

  async findAllGroupByZone() {
    const zoneSummary = await this.tableRepository
      .createQueryBuilder('table')
      .leftJoinAndSelect('table.zone', 'zone')
      .leftJoinAndSelect('zone.parentZone', 'parentZone')
      .select('zone.id', 'zoneId')
      .addSelect('zone.zoneLabel', 'zoneLabel')
      .addSelect('parentZone.zoneLabel', 'parentZoneLabel')
      .addSelect('COUNT(table.id)', 'tableCount')
      .groupBy('zone.id')
      .addGroupBy('zone.zoneLabel')
      .addGroupBy('parentZone.zoneLabel')
      .getRawMany();

    // Second query to get all tables with their zone information
    const tablesWithZones = await this.tableRepository.find({
      relations: ['zone'],
      where: { isActive: true },
    });

    // Combine the results
    return zoneSummary.map((zone) => ({
      ...zone,
      tableCount: parseInt(zone.tableCount),
      tables: tablesWithZones.filter((table) => table.zone?.id === zone.zoneId),
    }));
  }

  async findAllTablesByZoneUUID(
    id: string,
    page?: number | string,
    limit?: number | string,
    relations?: string[],
    sort?: string,
    withDeleted: boolean = false,
    onlyDeleted: boolean = false,
    select?: string[],
  ): Promise<{ data: Table[]; total: number; page: number; limit: number }> {
    const query = this.tableRepository.createQueryBuilder('table');
    query.where({ zone: { id } });

    const currentPage = Math.max(1, Number(page) || 1);
    const itemsPerPage = Math.max(1, Number(limit) || 10);

    const relationArray = await this.splitByComma(relations);

    if (relationArray && relationArray.length > 0) {
      relationArray.forEach((relation) => {
        query.leftJoinAndSelect(`table.${relation}`, relation);
      });
    }

    if (sort) {
      const [field, order] = sort.split(':');
      query.orderBy(
        `table.${field}`,
        order.toUpperCase() as 'ASC' | 'DESC',
      );
    } else {
      query.orderBy(`table.id`, 'ASC');
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
      query.andWhere(`table.deletedAt IS NULL`);
    }

    if (onlyDeleted) {
      query.andWhere(`table.deletedAt IS NOT NULL`);
    }

    if (select) {
      const selectArray = await this.splitByComma(select);
      if (selectArray.length > 0) {
        const selectFields = ['id', ...selectArray];
        query.select(selectFields.map((field) => `table.${field}`));
      }
    }

    const [data, total] = await query.getManyAndCount();

    return { data, total, page: currentPage, limit: itemsPerPage };
  }
}
