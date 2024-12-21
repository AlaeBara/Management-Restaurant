import { IsNotEmpty, ValidateIf } from "class-validator";
import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { MaxLength, MinLength } from "class-validator";
import { BadRequestException } from "@nestjs/common";


export class CreateMenuItemTagDto {

    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(30)
    @ApiProperty({
        description: 'The tag of the menu item',
        example: 'tag1'
    })
    tag: string;
  
}
