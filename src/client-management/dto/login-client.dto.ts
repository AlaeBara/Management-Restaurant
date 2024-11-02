import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class LoginClientDto {
  @IsNotEmpty()
  @Length(5, 50)
  @ApiProperty({ description: 'The email or username of the client', example: 'john_doe or john.doe@example.com', required: true })
  emailOrUsername: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'The password of the client', example: 'password123', required: true })
  password: string;
}
