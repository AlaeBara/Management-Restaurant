
import { IsNotEmpty, IsNumber, IsOptional, IsUUID } from "class-validator";
import { DefaultValuePipe } from '@nestjs/common';
export class ExecutePurchaseMovementDto {
   /*  @IsUUID()
    @IsNotEmpty()
    purchaseItemId: string;

    @IsUUID()
    @IsNotEmpty()
    purchaseId: string; */

    @IsNumber()
    @IsNotEmpty()
    quantityToMove: number;

    @IsNumber()
    @IsOptional()
    quantityToReturn: number = 0;
}