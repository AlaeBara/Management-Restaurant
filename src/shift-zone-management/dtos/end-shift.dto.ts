import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";
export class EndShiftDTO {
    /* @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ description: 'The waiter id', example: 'e7d9fd91-ac0e-4289-986f-46416f30ccbf', required: true })
    waiterId: number; */

    @IsNotEmpty()
    @IsUUID()
    @ApiProperty({ description: 'The zone id', example: 'e7d9fd91-ac0e-4289-986f-46416f30ccbf', required: true })
    zoneId: string;
}