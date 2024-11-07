import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";
import { Column, RelationId } from "typeorm";


export class CreateStorageDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'The storage code', example: 'S001', required: true })
    storageCode: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'The storage name', example: 'Storage 1', required: true })
    storageName: string;


    @IsUUID()
    @IsOptional()
    @ApiProperty({ description: 'The sub storage id', example: '1', required: false })
    subStorageId: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ description: 'The storage place', example: 'Storage 1', required: false })
    storagePlace: string;
}
