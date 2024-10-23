import { Gender } from "@prisma/client";
import { IsEmail, isEmpty, IsEnum, IsNotEmpty, IsString, Length } from "class-validator";
import { IsUnique } from "src/common/decorators/is-unique-constraint.decorator";

export class CreateUserDto {
    @IsNotEmpty()
    @Length(3, 20)
    firstname:string;
 
    @IsNotEmpty()
    lastname:string;
  
    @IsNotEmpty()
    @IsString()
    @IsUnique(['User', 'username'])
    username:string;

    @IsNotEmpty()
    @IsString()
    password:string;

    @IsNotEmpty()
    @IsEmail()
    @IsUnique(['User', 'email'])
    email:string;

    @IsNotEmpty()
    @IsEnum(Gender)
    gender:Gender

}
