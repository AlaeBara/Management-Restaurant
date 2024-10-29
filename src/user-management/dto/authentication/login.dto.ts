import { IsNotEmpty, Length } from "class-validator";

export class LoginDto {

  @IsNotEmpty()
  @Length(3, 255)
  emailOrUsername: string;

  @IsNotEmpty()
  password: string;
}
