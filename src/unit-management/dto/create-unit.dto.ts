import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { BaseUnit } from '../enums/base-unit.enum';
import { UnitType } from '../enums/unit.enum';

export class CreateUnitDto {
  @IsEnum(UnitType)
  @IsNotEmpty()
  unit: UnitType;

  @IsEnum(BaseUnit)
  @IsNotEmpty()
  baseUnit: BaseUnit;   

  @IsNumber()
  @IsNotEmpty()
  conversionFactorToBaseUnit: number;
}
