import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from "class-validator";
import { ProductType } from "src/product-management/enums/type.enum";


export class UpdateProductDto {

    @IsOptional()
    @IsString()
    @MaxLength(15)
    @ApiProperty({ description: 'The SKU of the product', example: 'SKU123', required: true })
    productSKU: string;

    @IsOptional()
    @IsString()
    @MaxLength(75)
    @ApiProperty({ description: 'The name of the product', example: 'Product Name', required: true })
    productName: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ description: 'The description of the product', example: 'Product Description', required: false })
    productDescription: string;

    @IsOptional()
    @IsBoolean()
    @ApiProperty({ description: 'Whether the product is offered', example: true, required: true })
    isOffered: boolean;

    @IsEnum(ProductType)
    @IsOptional()
    @ApiProperty({ description: 'The type of the product', example: 'ingredient | baverage', required: true })
    productType: ProductType;

}