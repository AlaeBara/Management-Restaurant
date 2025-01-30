import { IsBoolean, IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, ValidateIf } from "class-validator";
import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { MaxLength, MinLength } from "class-validator";
import { BadRequestException } from "@nestjs/common";
import { Type } from "class-transformer";
import { DiscountMethod } from "src/menu-item-management/enums/discount-method.enum";

export class UpdateDiscountDto {
    @IsOptional()
    @IsString()
    @MinLength(3)
    @MaxLength(30)
    @ApiProperty({
        description: 'The sku of the product that will be used as discount',
        required: true,
        example: 'NEW2025'
    })
    discountSku: string;

    @IsOptional()
    @IsEnum(DiscountMethod)
    @ApiProperty({
        description: 'The type of the discount',
        required: true,
        example: DiscountMethod.PERCENTAGE
    })
    discountMethod: DiscountMethod;

    @IsOptional()
    @IsNumber()
    @ApiProperty({
        description: 'The value of the discount',
        required: true,
        example: 10
    })
    discountValue: number;

    @IsOptional()
    @IsBoolean()
    @ApiProperty({
        description: 'The active status of the discount',
        required: false,
        example: true
    })
    isActive: boolean;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    @ApiProperty({
        description: 'The start date time of the discount',
        required: false,
        example: new Date()
    })
    startDateTime: Date;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    @ApiProperty({
        description: 'The end date time of the discount',
        required: false,
        example: new Date()
    })
    endDateTime: Date;

}