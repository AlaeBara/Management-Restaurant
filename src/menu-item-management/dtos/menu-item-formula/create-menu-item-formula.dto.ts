import {
    IsNotEmpty,
    IsNumber,
    IsUUID
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";


export class CreateMenuItemFormulaDto {

    @IsNotEmpty()
    @IsUUID()
    @ApiProperty({
        description: 'The product id of the menu item',
        example: 'b3b2067b-e019-4fe3-ad69-c7468acb9db2'
    })
    productId: string;

    @IsNotEmpty()
    @IsNumber()
    @Transform(({ value }) => Number(value))
    @ApiProperty({
        description: 'The quantity used in the formula of the menu item',
        example: '10'
    })
    quantityFormula: number;

    @IsNotEmpty()
    @IsUUID()
    @ApiProperty({
        description: 'The unit id used in the formula of the menu item',
        example: 'b3b2067b-e019-4fe3-ad69-c7468acb9db2'
    })
    unitId: string;

    @IsNotEmpty()
    @IsUUID()
    @ApiProperty({
        description: 'The inventory id used in the formula of the menu item',
        example: 'b3b2067b-e019-4fe3-ad69-c7468acb9db2'
    })
    inventoryId: string;

}
