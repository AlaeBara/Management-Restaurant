import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEnum, IsOptional } from "class-validator";
import { FundType } from "../enums/fund-type.enum";


export class UpdateFundDto {
    @ApiProperty({ description: 'The sku of the fund (caisse, compte, etc...)', required: true, example: 'CM01' })
    @IsOptional()
    sku: string

    @ApiProperty({ description: 'The name of the fund', required: true, example: 'Fond de caisse' })
    @IsOptional()
    name: string;

    @ApiProperty({ description: 'The type of the fund', required: true, example: 'CASH' })
    @IsEnum(FundType)
    @IsOptional()
    type: FundType;

    @ApiProperty({ description: 'The active status of the fund', required: true, example: true })
    @IsBoolean()
    @IsOptional()
    isActive: boolean;  
    
    @ApiProperty({ description: 'The description of the fund', required: false, example: 'Fond de caisse' })
    @IsOptional()
    description: string;
}
