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
import { TableObjectDto } from '../dtos/table/table-object.dto';
import { isUUID } from 'class-validator';

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
  async generateTableQrCode(table: Table) {
    // Generate a QR code with the MENU_WITH_QRCODE_URL and the table id
    const qrcode = await this.qrcodeService.generateQrCode(
      process.env.CLIENT_MENU_BACKEND_ENDPOINT + table.id,
    );

    // Update the table with the QR code
    table.qrcode = qrcode;

    // Save the table
    return this.tableRepository.save(table);
  }

  async getMenuUrl(table: Table) {
    return process.env.CLIENT_MENU_URL + table.id;
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
    await this.generateTableQrCode(table);

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
   * Validate if a table exists with the given code and zone
   * @param tableCode string
   * @param zoneId string
   * @param throwIfFound boolean
   * @returns Promise<number>
   */
  async validateTable(tableCode: string, zoneId: string, throwIfFound: boolean = false) {
    // Find the table with the given code and zone
    const table = await this.tableRepository.count({
      where: {
        zone: { id: zoneId },
        tableCode: tableCode
      },
      withDeleted: false
    });

    // If throwIfFound is true and the table exists, throw a BadRequestException
    if (throwIfFound && table > 0) {
      throw new BadRequestException('La table existe déjà');
    }
  }

  async createManyTables(object: CreateManyTablesDto) {
    const zone = await this.zoneService.findOneByIdWithOptions(object.zoneUUID);

    if (object.startNumber > object.endNumber) {
      throw new BadRequestException('Le numérique de début doit être plus petit que le numérique de fin');
    }

    // Fetch all existing table codes for the zone in one query
    const existingTableCodes = new Set(
      (await this.getExistingTableCodesForZone(object.zoneUUID)).map((t) => t.tableCode)
    );

    const tableObjects: TableObjectDto[] = [];

    for (let i = object.startNumber; i <= object.endNumber; i++) {
      const tableCode = `T${i}-Z:${zone.zoneCode}`;

      if (existingTableCodes.has(tableCode)) {
        throw new BadRequestException(
          `Une table avec le code ${tableCode} existe déjà dans la zone ${zone.zoneLabel}. Veuillez Mettre à jour le code de la table ou supprimer la table existante.`
        );
      }

      tableObjects.push({
        tableCode,
        tableName: `Table ${i}`,
        zone: zone,
        qrcode: await this.qrcodeService.generateQrCode(
          process.env.CLIENT_MENU_BACKEND_ENDPOINT + tableCode,
        ),
        tableStatus: object.tableStatus || TableStatus.AVAILABLE,
        isActive: object.isActive !== undefined ? object.isActive : true,
      });
    }

    // Perform a bulk insert
    await this.tableRepository.insert(tableObjects);
  }

  async getExistingTableCodesForZone(zoneUUID: string): Promise<{ tableCode: string }[]> {
    return await this.tableRepository.find({
      where: { zone: { id: zoneUUID } },
      select: ['tableCode'], // Only fetch the tableCode column for efficiency
      withDeleted: false
    });
  }

  async getTableByIdOrTableCode(idOrTableCode: string) {
    let table: Table | null = null;

    if (isUUID(idOrTableCode)) {
      table = await this.tableRepository.findOne({
        where: { id: idOrTableCode },
        withDeleted: false
      });
    } else {
      table = await this.tableRepository.findOne({
        where: { tableCode: idOrTableCode },
        withDeleted: false
      });
    }

    if (!table) {
      throw new NotFoundException('La table n\'existe pas');
    }

    return table;
  }

  async getTableByIdForOrder(tableId: string) {
    const table = await this.tableRepository.findOneBy({
      id: tableId,
      isActive: true
    });

    if (!table) {
      throw new NotFoundException('La Table est obligatoire pour passer votre commande');
    }

    if (table.tableStatus !== TableStatus.AVAILABLE) {
      throw new BadRequestException('La table n\'est pas disponible');
    }

    return table;
  }

}