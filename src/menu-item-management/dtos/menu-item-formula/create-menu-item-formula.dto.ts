import { IsNotEmpty, IsNumber, IsOptional, IsUUID, ValidateIf } from "class-validator";
import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { MaxLength, MinLength } from "class-validator";
import { BadRequestException } from "@nestjs/common";


export class CreateMenuItemFormulaDto {

    @IsNotEmpty()
    @IsUUID()
    @ApiProperty({
        description: 'The product id of the menu item',
        example: 'b3b2067b-e019-4fe3-ad69-c7468acb9db2'
    })
    productId: string;

    @IsOptional()
    @IsNumber()
    @ApiProperty({
        description: 'The warning quantity of the menu item',
        example: '10'
    })
    warningQuantity: number;

    @IsOptional()
    @IsNumber()
    @ApiProperty({
        description: 'The quantity used in the formula of the menu item',
        example: '10'
    })
    quantityFormula: number;

   

    @IsOptional()
    @IsUUID()
    @ApiProperty({
        description: 'The unit id used in the formula of the menu item',
        example: 'b3b2067b-e019-4fe3-ad69-c7468acb9db2'
    })
    unitId: string;
  
}
