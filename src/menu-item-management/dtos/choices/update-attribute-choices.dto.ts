import { IsArray, IsOptional, IsString } from "class-validator";

export class UpdateAttributeWithChoicesDto {

    @IsString()
    @IsOptional()

    attribute: string;

    @IsArray()
    @IsOptional()
    @IsString({ each: true })
    choices: string[];
}
