import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";
import { RequestShiftStatus } from "../enums/request-shift.enum";
export class ResponseReassignmentRequestDTO {
    @IsNotEmpty()
    @IsUUID()
    @ApiProperty({ description: 'The Reassignment Request id', example: 'e7d9fd91-ac0e-4289-986f-46416f30ccbf', required: true })
    ReassignmentRequesId: string;

    @IsNotEmpty()
    @IsEnum(RequestShiftStatus)
    @ApiProperty({ description: 'Status Of Request', example: 'ACCEPTED | REJECTED', required: true })
    status: RequestShiftStatus

    @IsOptional()
    @IsString()
    @ApiProperty({ description: 'Reason for rejection', example: 'Employee is not qualified', required: false })
    rejectionReason:string
}