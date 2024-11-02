import { IsEmail, isEmpty, IsEnum, IsNotEmpty, IsOptional, IsString, Length } from "class-validator";
import { Gender } from "../../../common/enums/gender.enum";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
    @IsNotEmpty()
    @Length(3, 20)
    @IsString()
    @ApiProperty({ description: 'The first name of the user', example: 'John', required: true })
    firstname:string;
 
    @IsNotEmpty()
    @Length(3, 20)
    @ApiProperty({ description: 'The last name of the user', example: 'Doe', required: true })
    lastname:string;
  
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'The username of the user', example: 'john.doe', required: true })
    username:string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'The password of the user', example: 'password', required: true })
    password:string;

    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({ description: 'The email of the user', example: 'john.doe@example.com', required: true })
    email:string;

    @IsNotEmpty()
    @IsEnum(Gender)
    @ApiProperty({ description: 'The gender of the user', example: 'male', required: true })
    gender:Gender

    @IsOptional()
    @IsString()
    @ApiProperty({ description: 'The address of the user', example: '123 Main St, Anytown, USA', required: false })
    address: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ description: 'The phone number of the user', example: '1234567890', required: false })
    phone: string;
}
