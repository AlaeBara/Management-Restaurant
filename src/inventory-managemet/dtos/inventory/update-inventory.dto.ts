import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsUUID } from "class-validator";

export class UpdateInventoryDto  {

    @ApiProperty({ description: 'The sku of the inventory', required: false , example: '1234567890'})
    @IsOptional()
    sku: string;

    @ApiProperty({ description: 'The warning quantity of the inventory', required: false , example: 10})
    @IsOptional()
    @IsNumber()
    warningQuantity: number;

    @ApiProperty({ description: 'The storage id of the inventory', required: false , example: '1234567890'})
    @IsUUID()
    @IsOptional()
    storageId: string | null;

    @ApiProperty({ description: 'The product id of the inventory', required: false , example: '1234567890'})
    @IsUUID()
    @IsOptional()
    productId: string | null;
}
