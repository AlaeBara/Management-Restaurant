import { IsNotEmpty, IsUUID, IsBoolean, IsOptional, IsEnum } from "class-validator";
import { UUID } from "crypto";
import { TableStatus } from "src/zone-table-management/enums/table-status.enum";


export class CreateTableDto {

    @IsNotEmpty()
    tableName: string;

    @IsNotEmpty()
    tableCode: string;

    @IsNotEmpty()
    @IsUUID()
    zoneUUID: UUID;

    @IsBoolean()
    @IsOptional()
    isActive: boolean;

    @IsOptional()
    @IsEnum(TableStatus)
    tableStatus: TableStatus;   
}
