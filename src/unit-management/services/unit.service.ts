import { Repository } from 'typeorm';
import { GenericService } from 'src/common/services/generic.service';
import { Unit } from '../entities/unit.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

export class UnitService extends GenericService<Unit> {
  constructor(
    @InjectDataSource() dataSource: DataSource,
    @InjectRepository(Unit)
    private unitRepository: Repository<Unit>,
  ) {
    super(dataSource, Unit, 'unit');
  }
}
