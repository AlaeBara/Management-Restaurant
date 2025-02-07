import { IsNotEmpty, IsNumber, IsOptional, IsUUID, Min } from "class-validator";
import { IsULID } from "src/common/decorators/is-ulid.decorator";

export class AddChoiceToMenuItemDto {
    @IsNotEmpty()
    @IsUUID()
    menuItemId: string;

    @IsNotEmpty()
    @IsULID()
    choiceId: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    additionalPrice: number;
}   
