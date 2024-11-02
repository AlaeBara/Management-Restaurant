import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Gender } from 'src/common/enums/gender.enum';
import { Column } from 'typeorm';
import { statusClient } from '../enums/client.enum';
import { ApiProperty } from '@nestjs/swagger';
export class UpdateClientDto {
  @IsEnum(Gender) 
  @IsOptional()
  @ApiProperty({ description: 'The gender of the client', example: 'Male', required: false })
  gender: Gender;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'The address of the client', example: '123 Main St, Anytown, USA', required: false })
  address: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'The phone of the client', example: '1234567890', required: false })
  phone: string;

  @IsEnum(statusClient)
  @IsOptional()
  @ApiProperty({ description: 'The status of the client', example: 'Active', required: false })
  status: statusClient;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'The avatar of the client', example: 'avatar.png', required: false })
  avatar: string;
}
