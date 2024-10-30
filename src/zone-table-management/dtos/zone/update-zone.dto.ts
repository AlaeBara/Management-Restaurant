import { Column, ManyToOne, JoinColumn } from "typeorm";
import { Zone } from "../../entities/zone.entity";
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsUUID } from "class-validator";
import { UUID } from "crypto";


export class UpdateZoneDto {
  @IsOptional()
  zoneLabel: string;

  @IsOptional()
  zoneCode: string;

  @IsOptional()
  @IsUUID()
  parentZoneUUID: UUID;
}
