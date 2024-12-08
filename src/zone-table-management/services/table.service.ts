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
import { CreateManyTablesDto } from '../dtos/table/create-many-tables.dto';

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

  /**
   * Generate a QR code for a table
   * @param table Table
   * @returns Promise<Table> with the QR code
   */
  async generateQrCode(table: Table) {
    // Generate a QR code with the MENU_WITH_QRCODE_URL and the table id
    const qrcode = await this.qrcodeService.generateQrCode(
      process.env.MENU_WITH_QRCODE_URL + table.id,
    );

    // Update the table with the QR code
    table.qrcode = qrcode;

    // Save the table
    return this.tableRepository.save(table);
  }

  /**
   * Assign a zone to a table
   * @param table Table
   * @param zoneId string
   * @returns Promise<Table> with the zone assigned
   */
  async assignZone(table: Table, zoneId: string) {
    // Find the zone with the given id
    const zone = await this.zoneService.findOneByIdWithOptions(zoneId);

    // Assign the zone to the table
    table.zone = zone;

    // Save the table
    return this.tableRepository.save(table);
  }

  /**
   * Validate if a table exists with the given code and zone
   * @param tableCode string
   * @param zoneId string
   * @param throwIfFound boolean
   * @returns Promise<Table | null>
   */
  async validateTable(tableCode: string, zoneId: string, throwIfFound: boolean = false) {
    // Find the table with the given code and zone
    const table = await this.tableRepository.findOne({
      where: {
        zone: { id: zoneId },
        tableCode: tableCode
      },
      withDeleted: false
    });

    // If throwIfFound is true and the table exists, throw a BadRequestException
    if (throwIfFound && table) {
      throw new BadRequestException('La table existe déjà');
    }

    // Return the table or null
    return table;
  }

  /**
   * Create a table
   * @param tableDto CreateTableDto
   * @returns Promise<Table>
   */
  async createTable(tableDto: CreateTableDto): Promise<Table> {
    // Validate if the table exists with the given code and zone
    await this.validateTable(tableDto.tableCode, tableDto.zoneUUID, true);

    // Create the table object
    const tableObject = this.tableRepository.create(tableDto);

    // Save the table
    const table = await this.tableRepository.save(tableObject);

    // If the zoneUUID is provided, assign the zone to the table
    if (tableDto.zoneUUID) await this.assignZone(table, tableDto.zoneUUID);

    // Generate a QR code for the table
    await this.generateQrCode(table);

    // Return the table
    return table;
  }

  async updateTable(id: string, tableDto: UpdateTableDto) {
    const table = await this.findOneByIdWithOptions(id);

    if (tableDto.tableCode && tableDto.tableCode !== table.tableCode) {
      await this.validateTable(tableDto.tableCode, table.zoneId, true);
    }

    /* 
    // i comment this part because i don't want to update the zone , doesnt make sense cause we create the table inside zone
    let zone: Zone | null = table.zone;
    if (tableDto.zoneUUID && tableDto.zoneUUID !== zone?.id) {
    zone = await this.zoneService.findOrThrowByAttribute({
    id: tableDto.zoneUUID,
    });
    table.zone = zone; 
    // await this.assignZone(table, tableDto.zoneUUID);
    } */

    Object.assign(table, tableDto);

    return this.tableRepository.save(table);
  }

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

  /**
   * Create multiple tables for a specific zone with a range of numbers
   * @param object CreateManyTablesDto
   * @returns Promise<void>
   */
  async createManyTables(object: CreateManyTablesDto) {
    const zone = await this.zoneService.findOneByIdWithOptions(object.zoneUUID);
    const tableObjects: CreateTableDto[] = [];

    // Loop through the range of numbers and create a table object for each
    for (let i = object.startNumber; i < object.endNumber + 1; i++) {
      const TableDto: CreateTableDto = {
        tableCode: `T${i}-Z:${zone.zoneCode}`, // Create the table code based on the zone code and the loop number
        tableName: `Table ${i}`, // Create the table name based on the loop number
        zoneUUID: object.zoneUUID,
        tableStatus: object.tableStatus ? object.tableStatus : TableStatus.AVAILABLE,
        isActive: object.isActive ? object.isActive : true,
      };

      // Check if a table with the same code already exists in the zone
      const isTableExist = await this.validateTable(TableDto.tableCode, TableDto.zoneUUID)

      if (isTableExist) {
        throw new BadRequestException(
          `Une table avec le code ${TableDto.tableCode} existe déjà dans la zone ${zone.zoneLabel}. Veuillez Mettre à jour le code de la table ou supprimer la table existante.`
        );
      }

      // Add the table object to the array
      tableObjects.push(TableDto);
    }

    // Use Promise.all to create all the tables at the same time
    await Promise.all(
      tableObjects.map(async (table) => {
        await this.createTable(table);
      })
    );
  }
}