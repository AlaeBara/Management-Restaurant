import { IsDate, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { PurchaseLinePaiementStatus } from "../enums/purchase-paiement-status.enum";


export class CreatePurchasePaiementDto {
    @IsNotEmpty()
    @IsNumber()
    amount: number;

    @IsOptional()
    @IsEnum(PurchaseLinePaiementStatus)
    status: PurchaseLinePaiementStatus;

    @IsOptional()
    @IsString()
    reference: string;

    @IsOptional()
    @IsDateString()
    datePaiement: Date;
}
