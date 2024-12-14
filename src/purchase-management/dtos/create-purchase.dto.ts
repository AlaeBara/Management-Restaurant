import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsDate, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Max, Min } from "class-validator";
import { CreatePurchaseItemDto } from "./create-purchase-item.dto";

export class CreatePurchaseDto {
    @IsNotEmpty()
    @IsUUID()
    @ApiProperty({ description: 'The id of the supplier', example: '123e4567-e89b-12d3-a456-426614174000', required: true })
    supplierId: string;

    @IsNotEmpty()
    @IsUUID()
    @ApiProperty({ description: 'The id of the source payment', example: '123e4567-e89b-12d3-a456-426614174000', required: true })
    sourcePaymentId: string;

    @IsDateString()
    @ApiProperty({ description: 'The date of the purchase', example: '2024-01-01', required: true })
    purchaseDate: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ description: 'The owner reference of the purchase', example: '123e4567-e89b-12d3-a456-426614174000', required: false })
    ownerReferenece: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'The supplier reference of the purchase', example: '123e4567-e89b-12d3-a456-426614174000', required: true })
    supplierReference: string;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ description: 'The total amount HT of the purchase', example: '100', required: true })
    totalAmountHT: number;

    @IsNumber()
    @Min(0)
    @Max(100)
    @ApiProperty({ description: 'The tax percentage of the purchase', example: '20', required: true })
    taxPercentage: number

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ description: 'The total amount TTC of the purchase', example: '100', required: true })
    totalAmountTTC: number;

    @IsArray()
    @IsNotEmpty()
    @ApiProperty({ description: 'The items of the purchase', example: '100', required: true })
    items: CreatePurchaseItemDto[];

    @IsString()
    @IsOptional()
    @ApiProperty({ description: 'The note of the purchase', example: '100', required: false })
    note: string;
}
