import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";


export class CreateMenuItemTranslate {
    @IsNotEmpty()
    @IsUUID()
    @ApiProperty({
        description: 'The language id',
        required: true,
        example: '925da91c-aebc-4630-8085-494443374115'
    })
    languageId: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'The name of the product menu',
        required: true,
        example: "pizza fruit de mere"
    })
    name: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'Desription of the product menu',
        required: true,
        example: "pizza fruit de mere: pizza, tone ..."
    })
    description: string;
}