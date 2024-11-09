import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from "class-validator";
import { ProductType } from "src/product-management/enums/type.enum";


export class CreateProductDto {

    @IsNotEmpty()
    @IsString()
    @MaxLength(15)
    @ApiProperty({ description: 'The SKU of the product', example: 'SKU123', required: true })
    productSKU: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(75)
    @ApiProperty({ description: 'The name of the product', example: 'Product Name', required: true })
    productName: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ description: 'The description of the product', example: 'Product Description', required: false })
    productDescription: string;

    @IsNotEmpty()
    @IsBoolean()
    @ApiProperty({ description: 'Whether the product is offered', example: true, required: true })
    isOffered: boolean;

    @IsEnum(ProductType)
    @IsNotEmpty()
    @ApiProperty({ description: 'The type of the product', example: 'ingredient | baverage', required: true })
    productType: ProductType;

    @IsOptional()
    @IsUUID()
    @ApiProperty({ description: 'The id of the unit', example: '123e4567-e89b-12d3-a456-426614174000', required: true })
    unitId: string | null;

}