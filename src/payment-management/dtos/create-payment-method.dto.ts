import {
    IsNotEmpty,
    IsString
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreatePaymentMethodDto {

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'The name of the payment method',
        example: 'Cash',
        required: true,
    })
    name: string;

}
