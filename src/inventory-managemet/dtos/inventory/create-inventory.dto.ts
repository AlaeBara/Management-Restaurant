import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsUUID } from "class-validator";

export class CreateInventoryDto  {

    @ApiProperty({ description: 'The sku of the inventory', required: true , example: '1234567890'})
    @IsNotEmpty()
    sku: string;

    @ApiProperty({ description: 'The warning quantity of the inventory', required: true , example: 10})
    @IsNumber()
    @IsNotEmpty()
    warningQuantity: number;

    @ApiProperty({ description: 'The storage id of the inventory', required: true , example: '1234567890'})
    @IsUUID()
    @IsNotEmpty()
    storageId: string;

    @ApiProperty({ description: 'The product id of the inventory', required: true , example: '1234567890'})
    @IsUUID()
    @IsNotEmpty()
    productId: string | null;
}