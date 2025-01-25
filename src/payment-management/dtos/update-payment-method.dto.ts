import {
    IsOptional,
    IsString
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdatePaymentMethodDto {

    @IsOptional()
    @IsString()
    @ApiProperty({
        description: 'The name of the payment method',
        example: 'Cash',
        required: false,
    })
    name: string;

}
