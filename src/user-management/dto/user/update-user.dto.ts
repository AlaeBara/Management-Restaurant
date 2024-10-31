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
export class UpdateUserDto {
  @IsOptional()
  @Length(5, 20)
  firstname: string;

  @IsOptional()
  @Length(5, 20)
  lastname: string;

  @IsOptional()
  @IsEnum(Gender)
  gender: Gender;

  @IsOptional()
  address: string;

  @IsOptional()
  @IsEnum(UserStatus)
  status: UserStatus;

  @IsOptional()
  phone: string;
}
