import { IsEnum } from 'class-validator';
import { IsOptional } from 'class-validator';
import { IsNumber } from 'class-validator';
import { BaseUnit } from '../enums/base-unit.enum';
import { UnitType } from '../enums/unit.enum';


export class UpdateUnitDto {
  @IsEnum(UnitType)
  @IsOptional()
  unit: UnitType;

  @IsEnum(BaseUnit)
  @IsOptional()
  baseUnit: BaseUnit;

  @IsNumber()
  @IsOptional()
  conversionFactorToBaseUnit: number;
}
