import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class ChangeFundSourceDto {
    @IsNotEmpty()
    @IsString()
    @IsUUID()
    fundId: string;

    @IsNotEmpty()
    @IsString()
    @IsUUID()
    operationId: string;
}
