import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsUUID } from "class-validator";

export class CreateInventoryDto  {

    @ApiProperty({ description: 'The sku of the inventory', required: true , example: '1234567890'})
    @IsNotEmpty()
    sku: string;

    @ApiProperty({ description: 'The warning quantity of the inventory', required: true , example: 10})
    @IsNotEmpty()
    warningQuantity: number;

    @ApiProperty({ description: 'The total quantity of the inventory', required: true , example: 10})
    @IsNotEmpty()
    totalQuantity: number;

    @ApiProperty({ description: 'The storage id of the inventory', required: true , example: '1234567890'})
    @IsUUID()
    @IsOptional()
    storageId: string;

    @ApiProperty({ description: 'The product id of the inventory', required: true , example: '1234567890'})
    @IsUUID()
    @IsOptional()
    productId: string | null;
}