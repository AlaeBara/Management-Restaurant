import { IsNotEmpty, IsUUID, IsBoolean, IsOptional, IsEnum } from "class-validator";
import { UUID } from "crypto";
import { TableStatus } from "src/zone-table-management/enums/table-status.enum";
import { ApiProperty } from '@nestjs/swagger';

export class CreateManyTablesDto {

    @IsNotEmpty()
    @ApiProperty({ description: 'The start number of the tables', example: 'Table 1', required: true })
    startNumber: number;

    @IsNotEmpty()
    @ApiProperty({ description: 'The end number of the tables', example: 'Table 1', required: true })
    endNumber: number;

    @IsNotEmpty()
    @IsUUID()
    @ApiProperty({ description: 'The UUID of the zone', example: '123e4567-e89b-12d3-a456-426614174000', required: true })
    zoneUUID: UUID;

    @IsBoolean()
    @IsOptional()
    @ApiProperty({ description: 'The status of the table', example: true, required: false })
    isActive: boolean;

    @IsOptional()
    @IsEnum(TableStatus)
    @ApiProperty({ description: 'The status of the table', example: 'free', required: false })
    tableStatus: TableStatus;
}
