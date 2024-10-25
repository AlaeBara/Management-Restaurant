import {
  IsEmail,
  isEmpty,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { Gender } from '../../enums/gender.enum';
import { UserStatus } from '../../enums/user-status.enum';
export class UpdateUserDto {
  @Length(5, 20)
  firstname: string;

  @Length(5, 20)
  lastname: string;

  @IsNotEmpty()
  @IsEnum(Gender)
  gender: Gender;

  @IsOptional()
  address: string;

  @IsOptional()
  @IsEnum(UserStatus)
  status: UserStatus;
}
