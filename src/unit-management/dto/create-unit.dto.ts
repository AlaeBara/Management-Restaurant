import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { BaseUnit } from '../enums/base-unit.enum';
import { UnitType } from '../enums/unit.enum';
import { ApiProperty } from '@nestjs/swagger';
export class CreateUnitDto {
  @IsEnum(UnitType)
  @IsNotEmpty()
  @ApiProperty({ description: 'The type of the unit', example: 'kg', required: true })
  unit: UnitType;

  @IsEnum(BaseUnit)
  @IsNotEmpty()
  @ApiProperty({ description: 'The base unit of the unit', example: 'g', required: true })
  baseUnit: BaseUnit;   

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'The conversion factor to the base unit', example: 0.001, required: true })
  conversionFactorToBaseUnit: number;
}
