import { IsOptional, IsString } from "class-validator";
import { IsULID } from "src/common/decorators/is-ulid.decorator";

export class UpdateChoiceDto {
    @IsOptional()
    @IsString()
    value: string;

    @IsOptional()
    @IsULID()
    attributeId: string;
}
