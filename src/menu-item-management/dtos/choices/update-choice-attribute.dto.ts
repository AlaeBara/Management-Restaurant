import { IsNotEmpty, IsString } from "class-validator";

export class UpdateChoiceAttributeDto {
    @IsNotEmpty()
    @IsString()
    attribute: string;
}
