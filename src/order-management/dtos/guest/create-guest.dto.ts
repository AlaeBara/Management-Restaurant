import {
    IsOptional,
    IsString
} from "class-validator";

export class CreateGuestDto {

    @IsOptional()
    @IsString()
    fullname: string;

    @IsOptional()
    @IsString()
    phoneNumber: string;

    @IsOptional()
    @IsString()
    email: string;

}
