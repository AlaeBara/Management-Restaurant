import { IsNotEmpty, Length } from "class-validator";

export class LoginDto {

  @IsNotEmpty()
  @Length(5, 255)
  emailOrUsername: string;

  @IsNotEmpty()
  password: string;
}
