import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID } from "class-validator";


export class AssignSubStorageDto {
    @IsNotEmpty()
    @IsUUID()
    @ApiProperty({ description: 'The sub storage id', example: '4522ab6e-7ae7-4cea-b79a-b8761e99b95f', required: true })
    subStorageId: string;
}
