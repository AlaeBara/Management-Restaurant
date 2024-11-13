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
    }

    const updateData = {
      ...(tableDto.tableCode && { tableCode: tableDto.tableCode }),
      ...(tableDto.tableName && { tableName: tableDto.tableName }),
      ...(tableDto.isActive && { isActive: tableDto.isActive }),
      ...(tableDto.tableStatus && { tableStatus: tableDto.tableStatus }),
      zone,
    };

    return this.tableRepository.update(id, updateData);
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

  async findAllTablesByZoneUUID(id: string) {
    return this.tableRepository.find({
      where: { zone: { id } },
    //  relations: ['parentZone'],
    });
  }
}
