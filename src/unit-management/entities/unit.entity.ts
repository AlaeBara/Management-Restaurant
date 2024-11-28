import { PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { Column, CreateDateColumn, DeleteDateColumn, Entity } from 'typeorm';
import { BaseUnit } from '../enums/base-unit.enum';
import { UnitType } from '../enums/unit.enum';
import { BaseEntity } from 'src/common/entities/base.entity';

@Entity(process.env.DATASET_PREFIX + 'units')
export class Unit extends BaseEntity {
  @Column({ type: 'enum', enum: UnitType })
  unit: UnitType;

  @Column({ type: 'enum', enum: BaseUnit,nullable:true })
  baseUnit: BaseUnit;

  @Column({type:"float" , nullable:true})
  conversionFactorToBaseUnit: number;
}
