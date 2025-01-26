import {
    IsOptional,
    IsString
} from "class-validator";

export class UpdateGuestDto {

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
