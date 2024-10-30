import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { GenericService } from 'src/common/services/generic.service';
import { Zone } from '../entities/zone.entity';
import { CreateZoneDto } from '../dtos/zone/create-zone.dto';
import { UpdateZoneDto } from '../dtos/zone/update-zone.dto';
import { TableService } from './table.services';
@Injectable()
export class ZoneService extends GenericService<Zone> {
  constructor(
    @InjectDataSource() dataSource: DataSource,
    @InjectRepository(Zone)
    private zoneRepository: Repository<Zone>,
    @Inject(forwardRef(() => TableService))
    private readonly tableService: TableService,
  ) {
    super(dataSource, Zone, 'zone');
  }

  async createZone(zoneDto: CreateZoneDto) {
    let parentZone: Zone | null = null;

    await this.throwIfFoundByAnyAttribute({ zoneCode: zoneDto.zoneCode },[],true);

    if (zoneDto.parentZoneUUID) {
      parentZone = await this.zoneRepository.findOne({
        where: { id: zoneDto.parentZoneUUID },
      });
      if (parentZone) zoneDto = { ...parentZone, ...zoneDto };
    }
    return this.zoneRepository.save(zoneDto);
  }

  async updateZoneByUUID(id: string, zoneDto: UpdateZoneDto) {
    // Validate existing zone
    const existingZone = await this.findOneByUUID(id);
    if (!existingZone) {
      throw new BadRequestException('Zone not found');
    }

    // Check if new zone code already exists (if being updated)
    if (zoneDto.zoneCode && zoneDto.zoneCode !== existingZone.zoneCode) {
      await this.throwIfFoundByAnyAttribute({ zoneCode: zoneDto.zoneCode });
    }

    let parentZone: Zone | null = existingZone.parentZone;

    // Handle parent zone assignment
    if (zoneDto.parentZoneUUID) {
      parentZone = await this.validateZoneReassignment(id, zoneDto.parentZoneUUID);

      // Prevent circular dependencies Note: Need to check the circular dependency before assigning the parent zone
    }

    // Create update object with only defined properties
    const updateData = {
      ...(zoneDto.zoneLabel && { zoneLabel: zoneDto.zoneLabel }),
      ...(zoneDto.zoneCode && { zoneCode: zoneDto.zoneCode }),
      parentZone
    };

    // Perform update and return updated zone
    await this.zoneRepository.update(id, updateData);
  }

  /*   private async wouldCreateCircularDependency(zoneId: string, parentId: string): Promise<boolean> {
    let currentZone = await this.findOneByUUID(parentId);
    
    while (currentZone?.parentZone) {
      if (currentZone.parentZone.id === zoneId) {
        return true;
      }
      currentZone = await this.findOneByUUID(currentZone.parentZone.id);
    }
    
    return false;
  } */

  async deleteByUUID(id: string) {
    // Use COUNT instead of fetching full records
    /* const [zoneCount, tableCount] = await Promise.all([
      this.countByAttribute({ parentZone: { id } }),
      this.tableService.countByAttribute({ zone: { id } }),
    ]);

    if (zoneCount > 0 || tableCount > 0) {
      throw new BadRequestException(
        `Cannot delete zone: it has ${[
          zoneCount && `${zoneCount} child zone${zoneCount > 1 ? 's' : ''}`,
          tableCount && `${tableCount} table${tableCount > 1 ? 's' : ''}`,
        ]
          .filter(Boolean)
          .join(' and ')} linked to it.`,
      );
    } */

    const zoneCount = await this.countByAttribute({ parentZone: { id } })
    if(zoneCount > 0) {
      throw new BadRequestException('Cannot delete zone: it has child zones linked to it.');
    }

    return this.zoneRepository.softDelete(id);
  }

  private async validateZoneReassignment(
    id: string,
    uuid: string | null,
  ): Promise<Zone | null> {
    const zoneExists = await this.findOneByUUID(id);
    if (!zoneExists) {
      throw new BadRequestException('Zone not found');
    }

    if (!uuid) return null;

    const parentZone = await this.findOneByUUID(uuid);
    if (!parentZone) {
      throw new BadRequestException('Parent zone not found');
    }

    if (parentZone.id === id) {
      throw new BadRequestException('Cannot assign zone to itself');
    }

    return parentZone;
  }

  async reassignChildZones(id: string, uuid: string | null) {
    const parentZone = await this.validateZoneReassignment(id, uuid);
    return this.zoneRepository.update(id, { parentZone });
  }
}
