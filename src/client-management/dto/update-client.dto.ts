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

export class UpdateClientDto {
  @IsEnum(Gender)
  @IsOptional()
  gender: Gender;

  @IsOptional()
  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  phone: string;

  @IsEnum(statusClient)
  @IsOptional()
  status: statusClient;

  @IsOptional()
  @IsString()
  avatar: string;
}
