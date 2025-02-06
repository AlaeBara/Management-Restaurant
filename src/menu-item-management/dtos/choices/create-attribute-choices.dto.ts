import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class CreateAttributeWithChoicesDto {
    @IsString()
    @IsNotEmpty()
    attribute: string;
    @IsArray()
    @IsNotEmpty()
    @IsString({ each: true })
    choices: string[];
}


