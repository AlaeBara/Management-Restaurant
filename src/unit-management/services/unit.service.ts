import { Not, Repository } from 'typeorm';
import { GenericService } from 'src/common/services/generic.service';
import { Unit } from '../entities/unit.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CreateUnitDto } from '../dto/create-unit.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UpdateUnitDto } from '../dto/update-unit.dto';

export class UnitService extends GenericService<Unit> {
  constructor(
    @InjectDataSource() dataSource: DataSource,
    @InjectRepository(Unit)
    private unitRepository: Repository<Unit>,
  ) {
    super(dataSource, Unit, 'unit');
  }

  /**
   * Creates a new unit
   * @param createUnitDto - The DTO containing the unit data
   * @returns The created unit
   * @throws BadRequestException if unit already exists
   */
  async createUnit(createUnitDto: CreateUnitDto) {

    const unit = this.unitRepository.create(createUnitDto);

    const existingUnit = await this.unitRepository.findOne({
      where: {
        unit: unit.unit,
        baseUnit: unit.baseUnit
      }
    });

    if (existingUnit) {
      throw new BadRequestException('Unit already exists');
    }

    return this.unitRepository.save(unit);
  }

  /**
   * Updates an existing unit
   * @param id - The ID of the unit to update
   * @param updateUnitDto - The DTO containing the update data
   * @returns The updated unit
   * @throws NotFoundException if unit not found
   * @throws BadRequestException if updated unit would conflict with existing unit
   */
  async updateUnit(id: string, updateUnitDto: UpdateUnitDto) {
    // Check if unit exists
    const isExistingUnit = await this.unitRepository.count({ where: { id } });

    if (isExistingUnit === 0) {
      throw new NotFoundException('Unit not found');
    }

    const unit = this.unitRepository.create(updateUnitDto);

    // If neither baseUnit nor unit is being updated, just update other fields
    if (!unit.baseUnit && !unit.unit) {
      return this.unitRepository.update(id, unit);
    }

    // Check for conflicts with existing units
    const existingUnit = await this.unitRepository.findOne({
      where: {
        unit: unit.unit,
        baseUnit: unit.baseUnit,
        id: Not(id) // Exclude current unit from check
      }
    });

    if (existingUnit) {
      throw new BadRequestException('Unit already exists');
    }

    return this.unitRepository.update(id, unit);
  }
}
