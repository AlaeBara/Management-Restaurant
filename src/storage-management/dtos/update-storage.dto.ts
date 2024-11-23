import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, IsUUID } from "class-validator";

export class UpdateStorageDto {
    @IsString()
    @IsOptional()
    @ApiProperty({ description: 'The storage code', example: 'S001', required: true })
    storageCode: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ description: 'The storage name', example: 'Storage 1', required: true })
    storageName: string;


    @IsUUID()
    @IsOptional()
    @ApiProperty({ description: 'The parent storage id', example: 'e7d9fd91-ac0e-4289-986f-46416f30ccbf', required: false })
    parentStorageId: string;
}