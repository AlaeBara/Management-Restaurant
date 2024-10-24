import { IsEmail, isEmpty, IsEnum, IsNotEmpty, IsString, Length } from "class-validator";
import { Gender } from "../../enums/gender.enum";

export class CreateUserDto {
    @IsNotEmpty()
    @Length(3, 20)
    firstname:string;
 
    @IsNotEmpty()
    lastname:string;
  
    @IsNotEmpty()
    @IsString()
    username:string;

    @IsNotEmpty()
    @IsString()
    password:string;

    @IsNotEmpty()
    @IsEmail()
    email:string;

    @IsNotEmpty()
    @IsEnum(Gender)
    gender:Gender

}
