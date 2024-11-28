import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { BaseUnit } from '../enums/base-unit.enum';
import { UnitType } from '../enums/unit.enum';
import { ApiProperty } from '@nestjs/swagger';
export class CreateUnitDto {
  @IsEnum(UnitType)
  @IsNotEmpty()
  @ApiProperty({ description: 'The type of the unit', example: 'kg', required: true })
  unit: UnitType;

  @IsEnum(BaseUnit)
  @IsOptional()
  @ApiProperty({ description: 'The base unit of the unit', example: 'g', required: false })
  baseUnit: BaseUnit;   

  @IsNumber()
  @IsOptional()
  @ApiProperty({ description: 'The conversion factor to the base unit', example: 0.001, required: false })
  conversionFactorToBaseUnit: number;
}
