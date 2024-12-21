import { IsBoolean, IsNotEmpty, IsOptional, ValidateIf } from "class-validator";
import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { MaxLength, MinLength } from "class-validator";
import { BadRequestException } from "@nestjs/common";


export class UpdateMenuItemTagDto {

    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(30)
    @ApiProperty({
        description: 'The tag of the menu item',
        example: 'breakfast'
    })
    tag: string;

    @IsOptional()
    @IsBoolean()
    @ApiProperty({
        description: 'The validate Action of the menu item tag (used to confirm the update even if the tag is in use)',
        example: true
    })
    validate: boolean;

  
}
