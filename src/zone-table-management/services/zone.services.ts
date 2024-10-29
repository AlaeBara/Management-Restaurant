import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { GenericService } from 'src/common/services/generic.service';
import { Zone } from '../entities/zone.entity';
import { CreateZoneDto } from '../dtos/zone/create-zone.dto';
@Injectable()
export class ZoneService extends GenericService<Zone> {
  constructor(
    @InjectDataSource() dataSource: DataSource,
    @InjectRepository(Zone)
    private zoneRepository: Repository<Zone>,
  ) {
    super(dataSource, Zone, 'zone');
  }

  async createZone(zoneDto: CreateZoneDto) {
    let parentZone: Zone | null = null;

    await this.throwIfFoundByAnyAttribute({zoneCode: zoneDto.zoneCode});

    if (zoneDto.parentZoneUUID) {
      parentZone = await this.zoneRepository.findOne({
        where: { id: zoneDto.parentZoneUUID },
      });
      if (parentZone) zoneDto = { ...parentZone, ...zoneDto };
    }
    return this.zoneRepository.save(zoneDto);
  }
}
