import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength, IsUUID, IsBoolean, IsDate, IsArray, IsString as IsStringArray, IsOptional, Matches } from "class-validator";


export class UpdateCategoryDto {

    @IsString()
    @IsOptional()
    @MaxLength(50)
    @ApiProperty({ description: 'The name of the category', example: 'Food', required: true })
    categoryName: string;

    @IsString()
    @IsOptional()
    @MaxLength(15)
    @ApiProperty({ description: 'The code of the category', example: 'FOOD', required: true })
    categoryCode: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ description: 'The description of the category', example: 'Food category', required: false })
    categoryDescription: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ description: 'The id of the parent category', example: '123e4567-e89b-12d3-a456-426614174000', required: false })
    parentCategoryId?: string | null;

    @IsBoolean()
    @IsOptional()
    @ApiProperty({ description: 'Whether the category is time restricted', example: true, required: false })
    isTimeRestricted: boolean;

    @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
        message: 'Time must be in HH:mm format'
    })
    @IsOptional()
    @ApiProperty({ description: 'The start time of the category', example: '10:00', required: false })
    activeTimeStart: string;

    @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
        message: 'Time must be in HH:mm format'
    })
    @IsOptional()
    @ApiProperty({ description: 'The end time of the category', example: '22:00', required: false })
    activeTimeEnd: string;

    @IsArray()
    @IsOptional()
    @IsString({ each: true })
    @ApiProperty({ description: 'The days of the week the category is active', example: ['Monday', 'Wednesday', 'Friday'], required: false })
    activeDays: string[];

}
