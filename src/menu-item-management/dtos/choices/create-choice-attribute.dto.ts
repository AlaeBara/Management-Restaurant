import { IsNotEmpty, IsString } from "class-validator";

export class CreateChoiceAttributeDto {
    @IsNotEmpty()
    @IsString()
    attribute: string;
}
