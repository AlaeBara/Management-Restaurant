import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";
export class ReassignmentShiftDTO {
    @IsNotEmpty()
    @IsUUID()
    @ApiProperty({ description: 'The Shift id', example: 'e7d9fd91-ac0e-4289-986f-46416f30ccbf', required: true })
    zoneId: string;

 /*    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ description: 'The waiter id', example: 'e7d9fd91-ac0e-4289-986f-46416f30ccbf', required: true })
    RequestWaiterId: number; */
}