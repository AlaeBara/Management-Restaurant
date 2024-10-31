import { IsEmail, IsNotEmpty, Length } from 'class-validator';
import { Gender } from 'src/common/enums/gender.enum';

export class createClientDto {
  @IsNotEmpty()
  @Length(5,30)
  username: string;
  @IsNotEmpty()
  @Length(5,50)
  fullname: string;
  @IsNotEmpty()
  gender: Gender;
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @Length(8,30)
  password: string;
}
