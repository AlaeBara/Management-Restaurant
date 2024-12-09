import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsUUID } from "class-validator";
import { FundType } from "../../enums/fund-type.enum";
import { FundOperation, FundOperationStatus } from "src/fund-management/enums/fund-operation.enum";


export class CreateFundOperationDto {
    @ApiProperty({ description: 'The operation to perform', required: true, example: 'deposit' })
    @IsNotEmpty()
    @IsEnum(FundOperation)
    operationType: FundOperation;

    @ApiProperty({ description: 'The Action type of the Operation', required: false , example: 'increase'})
    @IsOptional()
    @IsEnum(['increase','decrease'])
    operationAction: string

    @ApiProperty({ description: 'The amount of the operation', required: true, example: 100 })
    @IsNotEmpty()
    amount: number;

    @ApiProperty({ description: 'The fund id of the operation', required: true, example: '123e4567-e89b-12d3-a456-426614174000' })
    @IsNotEmpty()
    @IsUUID()
    fundId: string;

    @ApiProperty({ description: 'The note of the operation', required: false, example: 'Note de l\'operation' })
    @IsOptional()
    note: string;

    @ApiProperty({ description: 'The reference of the operation', required: false, example: 'BC20243434' })
    @IsOptional()
    reference: string;

    @ApiProperty({ description: 'The date of the operation', required: true, example: '2024-01-01 10:00:00' })
    @IsNotEmpty()
    dateOperation: Date;

    @ApiProperty({ description: 'The status of the operation', required: false, example: 'pending' })
    @IsOptional()
    @IsEnum(FundOperationStatus)
    status: FundOperationStatus;
}
