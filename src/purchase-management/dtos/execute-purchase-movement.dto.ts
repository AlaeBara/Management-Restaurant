
import { IsNotEmpty, IsNumber, IsOptional, IsUUID } from "class-validator";
import { DefaultValuePipe } from '@nestjs/common';
import { ApiProperty } from "@nestjs/swagger";
export class ExecutePurchaseMovementDto {
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ description: 'The quantity to move', example: 10 })
    quantityToMove: number;

    @IsNumber()
    @IsOptional()
    @ApiProperty({ description: 'The quantity to return', example: 0 })
    quantityToReturn: number = 0;
}