import {  IsNotEmpty, Length } from "class-validator";


export class UpdateUsernameDto {
    @IsNotEmpty()
    @Length(5, 20)
    username:string;
}