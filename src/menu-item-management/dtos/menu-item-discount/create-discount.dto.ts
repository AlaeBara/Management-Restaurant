import { IsArray, IsBoolean, IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, ValidateIf } from "class-validator";
import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { MaxLength, MinLength } from "class-validator";
import { BadRequestException } from "@nestjs/common";
import { DiscountMethod } from "src/menu-item-management/enums/discount-method.enum";
import { Type } from "class-transformer";
import { DiscountType } from "src/menu-item-management/enums/discount-type.enum";

export class CreateDiscountDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(30)
    @ApiProperty({
        description: 'The sku of the product that will be used as discount',
        required: true,
        example: 'NEW2025'
    })
    discountSku: string;

    @IsNotEmpty()
    @IsEnum(DiscountMethod)
    @ApiProperty({
        description: 'The type of the discount',
        required: true,
        example: DiscountMethod.PERCENTAGE
    })
    discountMethod: DiscountMethod;

    @IsOptional()
    @IsEnum(DiscountType)
    @ApiProperty({
        description: 'The type of the discount',
        required: true,
        example: DiscountType.REGULARLY
    })
    discountType: DiscountType;

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({
        description: 'The value of the discount',
        required: true,
        example: 10
    })
    discountValue: number;

    @IsOptional()
    @IsNumber()
    @ApiProperty({
        description: 'The usage quota of the discount',
        required: false,
        example: 25
    })
    usageQuota: number;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    @ApiProperty({
        description: 'The days of the week when the discount is active',
        required: false,
        example: ['Monday', 'Tuesday']
    })
    activeDays: string[];

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
    @ValidateIf((obj, value) => {
        if (value) {
            const date = new Date(value);
            return date.getHours() === 0 && 
                   date.getMinutes() === 0 && 
                   date.getSeconds() === 0 && 
                   date.getMilliseconds() === 0;
        }
        return true;
    })
    @ApiProperty({
        description: 'The start date of the discount (must not include time)',
        required: false,
        example: '2024-03-15'
    })
    startDate: Date;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    @ValidateIf((obj, value) => {
        if (value) {
            const date = new Date(value);
            return date.getHours() === 0 && 
                   date.getMinutes() === 0 && 
                   date.getSeconds() === 0 && 
                   date.getMilliseconds() === 0;
        }
        return true;
    })
    @ApiProperty({
        description: 'The end date of the discount (must not include time)',
        required: false,
        example: '2024-03-20'
    })
    endDate: Date;
    

    @IsOptional()
    @IsBoolean()
    @ApiProperty({
        description: 'The specific time of the discount',
        required: false,
        example: true
    })
    specificTime: boolean;

    @IsOptional()
    @IsString()
    @ApiProperty({
        description: 'The start time of the discount (HH:mm format)',
        required: false,
        example: '14:30'
    })
    startTime: string;

    @IsOptional()
    @IsString()
    @ApiProperty({
        description: 'The end time of the discount (HH:mm format)',
        required: false,
        example: '23:00'
    })
    endTime: string;

    
}