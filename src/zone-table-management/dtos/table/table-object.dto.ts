import { IsNotEmpty, IsUUID, IsBoolean, IsOptional, IsEnum } from "class-validator";
import { UUID } from "crypto";
import { TableStatus } from "src/zone-table-management/enums/table-status.enum";
import { ApiProperty } from '@nestjs/swagger';
import { Zone } from "src/zone-table-management/entities/zone.entity";

export class TableObjectDto {

  tableName: string;

    tableCode: string;

    isActive: boolean;

    tableStatus: TableStatus; 
  
    zone: Zone; 
}
