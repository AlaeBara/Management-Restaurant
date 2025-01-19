import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateExpenseTypeDto {
    @ApiProperty({ description: 'The name of the expense type', required: true, example: 'Frais de transport' })
    @IsNotEmpty()
    name: string;
}