import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID, IsBoolean, IsOptional, IsEnum } from "class-validator";
import { UUID } from "crypto";
import { TableStatus } from "src/zone-table-management/enums/table-status.enum";


export class UpdateTableDto {

    @IsOptional()
    @ApiProperty({ description: 'The name of the table', example: 'Table 1', required: false })
    tableName: string;

    @IsOptional()
    @ApiProperty({ description: 'The code of the table', example: 'T1', required: false })
    tableCode: string;

    @IsOptional()
    @IsUUID()
    @ApiProperty({ description: 'The UUID of the zone', example: '123e4567-e89b-12d3-a456-426614174000', required: false })
    zoneUUID: UUID;

    @IsBoolean()
    @ApiProperty({ description: 'The status of the table', example: true, required: false })
    @IsOptional()
    isActive: boolean;

    @IsOptional()
    @IsEnum(TableStatus)
    @ApiProperty({ description: 'The status of the table', example: 'free', required: false })
    tableStatus: TableStatus;
}
