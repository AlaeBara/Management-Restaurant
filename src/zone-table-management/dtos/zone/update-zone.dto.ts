import { Column, ManyToOne, JoinColumn } from "typeorm";
import { Zone } from "../../entities/zone.entity";
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsUUID } from "class-validator";
import { UUID } from "crypto";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateZoneDto {
  @IsOptional()
  @ApiProperty({ description: 'The label of the zone', example: 'Zone 1', required: false })
  zoneLabel: string;

  @IsOptional()
  @ApiProperty({ description: 'The code of the zone', example: 'Z1', required: false })
  zoneCode: string;

  @IsOptional()
  @IsUUID()
  @ApiProperty({ description: 'The UUID of the parent zone', example: '123e4567-e89b-12d3-a456-426614174000', required: false })
  parentZoneUUID: UUID;
}
