import { IsNotEmpty, IsUUID, IsBoolean, IsOptional } from "class-validator";
import { UUID } from "crypto";


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
}
