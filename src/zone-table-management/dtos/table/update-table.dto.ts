import { IsNotEmpty, IsUUID, IsBoolean, IsOptional, IsEnum } from "class-validator";
import { UUID } from "crypto";
import { TableStatus } from "src/zone-table-management/enums/table-status.enum";


export class UpdateTableDto {

    @IsOptional()
    tableName: string;

    @IsOptional()
    tableCode: string;

    @IsOptional()
    @IsUUID()
    zoneUUID: UUID;

    @IsBoolean()
    @IsOptional()
    isActive: boolean;

    @IsOptional()
    @IsEnum(TableStatus)
    tableStatus: TableStatus;
}
