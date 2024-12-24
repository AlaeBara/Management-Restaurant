import { IsNotEmpty, IsNumber, IsOptional, IsUUID, ValidateIf } from "class-validator";
import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { MaxLength, MinLength } from "class-validator";
import { BadRequestException } from "@nestjs/common";


export class CreateMenuItemPriceDto {

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({
        description: 'The price of the menu item',
        example: '99.99'
    })
    basePrice: number;

    @IsOptional()
    @IsUUID()
    @IsString()
    @ApiProperty({
        description: 'The discount id of the menu item',
        example: 'b3b2067b-e019-4fe3-ad69-c7468acb9db2'
    })
    discountId: string;
  
}
