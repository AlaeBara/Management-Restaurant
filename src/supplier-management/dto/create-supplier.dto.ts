import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { SupplierStatus } from '../enums/status-supplier.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSupplierDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({description: 'The name of the supplier',example: 'John Doe',required: true})
  name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({description: 'The address of the supplier',example: '123 Main St, Anytown, USA',required: true})
  address: string;

  @IsOptional()
  @IsString()
  @ApiProperty({description: 'The fax of the supplier',example: '123-456-7890',required: false})
  fax: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({description: 'The phone of the supplier',example: '123-456-7890',required: true})
  phone: string;

  @IsOptional()
  @IsEmail()
  @ApiProperty({description: 'The email of the supplier',example: 'john.doe@example.com',required: false})
  email: string;

  @IsOptional()
  @IsString()
  @ApiProperty({description: 'The website of the supplier',example: 'https://www.example.com',required: false})
  website: string;

  @IsOptional()
  @IsString()
  @ApiProperty({description: 'The description of the supplier',example: 'This is a description of the supplier',required: false})
  description: string;

  @IsOptional()
  @IsEnum(SupplierStatus)
  @ApiProperty({description: 'The status of the supplier',example: 'ACTIVE',required: false})
  status: SupplierStatus;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({description: 'The rc number of the supplier',example: '1234567890',required: true})
  rcNumber: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({description: 'The ice number of the supplier',example: '1234567890',required: true})
  iceNumber: string;
}