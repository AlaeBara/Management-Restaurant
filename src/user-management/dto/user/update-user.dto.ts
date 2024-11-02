import {
  IsEmail,
  isEmpty,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { Gender } from '../../../common/enums/gender.enum';
import { UserStatus } from '../../enums/user-status.enum';
import { ApiProperty } from '@nestjs/swagger';
export class UpdateUserDto {
  @IsOptional()
  @Length(3, 20)
  @IsString()
  @ApiProperty({ description: 'The first name of the user', example: 'John', required: false })
  firstname: string;

  @IsOptional()
  @Length(3, 20)
  @IsString()
  @ApiProperty({ description: 'The last name of the user', example: 'Doe', required: false })
  lastname: string;

  @IsOptional()
  @IsEnum(Gender)
  @ApiProperty({ description: 'The gender of the user', example: 'male', required: false })
  gender: Gender;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'The address of the user', example: '123 Main St, Anytown, USA', required: false })
  address: string;

  @IsOptional()
  @IsEnum(UserStatus)
  @ApiProperty({ description: 'The status of the user', example: 'active', required: false })
  status: UserStatus;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'The phone number of the user', example: '1234567890', required: false })
  phone: string;
}
