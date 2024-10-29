import { IsBoolean, IsEmail, IsNotEmpty, IsOptional } from "class-validator";


export class SendVerificationEmailDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;


  @IsBoolean()
  @IsOptional()
  forceResend?: boolean;
}

