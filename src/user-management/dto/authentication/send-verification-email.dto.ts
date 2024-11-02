import { IsBoolean, IsEmail, IsNotEmpty, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SendVerificationEmailDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ description: 'The email of the user', example: 'john.doe@example.com', required: true })
  email: string;


  @IsBoolean()
  @IsOptional()
  @ApiProperty({ description: 'Whether to force resend the verification email', example: false, required: false })
  forceResend?: boolean;
}

