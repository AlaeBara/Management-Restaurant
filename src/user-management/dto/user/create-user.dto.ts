import { IsEmail, isEmpty, IsEnum, IsNotEmpty, IsOptional, IsString, Length } from "class-validator";
import { Gender } from "../../enums/gender.enum";

export class CreateUserDto {
    @IsNotEmpty()
    @Length(5, 20)
    firstname:string;
 
    @IsNotEmpty()
    @Length(5, 20)
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

    @IsOptional()
    address: string;

    @IsOptional()
    phone: string;
}
