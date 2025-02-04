import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class CreateBatchChoiceDto {
    @IsArray()
    @IsNotEmpty()
    @IsString({ each: true })
    values: string[];
}
