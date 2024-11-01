import { PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { Column, CreateDateColumn, DeleteDateColumn, Entity } from 'typeorm';
import { BaseUnit } from '../enums/base-unit.enum';
import { UnitType } from '../enums/unit.enum';

@Entity()
export class Unit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: UnitType })
  unit: UnitType;

  @Column({ type: 'enum', enum: BaseUnit })
  baseUnit: BaseUnit;

  @Column()
  conversionFactorToBaseUnit: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
