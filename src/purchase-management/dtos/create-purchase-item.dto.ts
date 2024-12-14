import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsUUID } from "class-validator";

export class CreatePurchaseItemDto {
    @IsNotEmpty()
    @IsUUID()
    @ApiProperty({ description: 'The id of the product', example: '123e4567-e89b-12d3-a456-426614174000', required: true })
    productId: string;

    @IsNotEmpty()
    @IsUUID()
    @ApiProperty({ description: 'The id of the inventory', example: '123e4567-e89b-12d3-a456-426614174000', required: true })
    inventoryId: string;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ description: 'The quantity of the product', example: '100', required: true })
    quantity: number;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ description: 'The unit price HT of the product', example: '100', required: true })
    unitPrice: number;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ description: 'The total amount of the product', example: '100', required: true })
    totalAmount: number;
}