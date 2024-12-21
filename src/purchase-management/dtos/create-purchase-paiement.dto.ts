import { IsDate, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { PurchaseLinePaiementStatus } from "../enums/purchase-paiement-status.enum";
import { ApiProperty } from "@nestjs/swagger";


export class CreatePurchasePaiementDto {
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ description: 'The amount of the paiement', example: 100 })
    amount: number;

    @IsOptional()
    @IsEnum(PurchaseLinePaiementStatus)
    @ApiProperty({ description: 'The status of the paiement', example: PurchaseLinePaiementStatus.PAID })
    status: PurchaseLinePaiementStatus;

    @IsOptional()
    @IsString()
    @ApiProperty({ description: 'The reference of the paiement', example: 'RC-1234567890' })
    reference: string;

    @IsOptional()
    @IsDateString()
    @ApiProperty({ description: 'The date of the paiement', example: '2024-01-01' })
    datePaiement: Date;
}
