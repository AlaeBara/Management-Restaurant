import {  IsNotEmpty, Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateUsernameDto {
    @IsNotEmpty()
    @Length(5, 20)
    @ApiProperty({ description: 'The username of the user', example: 'john.doe', required: true })
    username:string;
}