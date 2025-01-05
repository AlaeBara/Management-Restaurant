import { IsOptional, IsString } from "class-validator";
import { IsEnum } from "class-validator";
import { CloudServices } from "../enums/cloud-services.enum";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCloudCredentialsDto {

    @IsEnum(CloudServices)
    service: CloudServices;

    @IsString()
    @IsOptional()
    @ApiProperty({ required: false, description: 'aws access key id' , example: 'AKIAIOSFODNN7EXAMPLE' })
    AWS_ACCESS_KEY_ID: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ required: false, description: 'aws secret access key' , example: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY' })
    AWS_SECRET_ACCESS_KEY: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ required: false, description: 'aws region' , example: 'us-east-1' })
    AWS_REGION: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ required: false, description: 'aws bucket name' , example: 'my-bucket' })
    AWS_BUCKET_NAME: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ required: false, description: 'cloudinary api key' , example: 'cloudinaryapikeyaasd2321dq3asweas2326' })
    CLOUDINARY_API_KEY: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ required: false, description: 'cloudinary api secret' , example: 'cloudinaryapisecretaasd2321dq3asweas2326' })
    CLOUDINARY_API_SECRET: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ required: false, description: 'cloudinary cloud name' , example: 'my-cloud' })
    CLOUDINARY_CLOUD_NAME: string;
}