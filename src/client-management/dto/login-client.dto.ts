import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginClientDto {
  @IsNotEmpty()
  @Length(5, 50)
  emailOrUsername: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
