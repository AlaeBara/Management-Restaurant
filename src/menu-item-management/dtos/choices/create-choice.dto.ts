import { IsNotEmpty, IsString } from "class-validator";
import { IsULID } from "src/common/decorators/is-ulid.decorator";

export class CreateChoiceDto {
    @IsNotEmpty()
    @IsString()
    value: string;

    @IsNotEmpty()
    @IsULID()
    attributeId: string;
}
