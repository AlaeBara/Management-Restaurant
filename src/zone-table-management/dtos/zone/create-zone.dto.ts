import { Column, ManyToOne, JoinColumn } from "typeorm";
import { Zone } from "../../entities/zone.entity";
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional } from "class-validator";
import { UUID } from "crypto";


export class CreateZoneDto {
  @IsNotEmpty()
  zoneLabel: string;

  @IsNotEmpty()
  zoneCode: string;

  @IsOptional()
  parentZoneUUID: UUID;
}
