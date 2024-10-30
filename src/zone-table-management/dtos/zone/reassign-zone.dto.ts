import { IsUUID, IsOptional } from "class-validator";

export class ReassignZoneDto {
    @IsUUID()
    @IsOptional()
    uuid: string | null;
}
