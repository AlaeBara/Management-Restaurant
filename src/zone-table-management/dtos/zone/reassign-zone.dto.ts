import { IsUUID, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
export class ReassignZoneDto {
    @IsUUID()
    @IsOptional()
    @ApiProperty({ description: 'The UUID of the zone', example: '123e4567-e89b-12d3-a456-426614174000', required: false })
    uuid: string | null;
}
