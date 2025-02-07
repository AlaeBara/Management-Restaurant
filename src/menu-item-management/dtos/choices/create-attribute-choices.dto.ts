import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateAttributeWithChoicesDto {

    @IsString()
    @IsNotEmpty()
    attribute: string;

    @IsArray()
    @IsOptional()
    @IsString({ each: true })
    choices: string[];

}
