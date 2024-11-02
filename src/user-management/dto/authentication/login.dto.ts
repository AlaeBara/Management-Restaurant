import { IsNotEmpty, Length, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {

  @IsNotEmpty()
  @Length(5, 255)
  @IsString()
  @ApiProperty({ description: 'The email or username of the user', example: 'john.doe@example.com', required: true })
  emailOrUsername: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'The password of the user', example: 'password', required: true })
  password: string;
}
