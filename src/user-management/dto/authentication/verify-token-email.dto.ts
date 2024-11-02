import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class VerifyEmailDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'The token to verify the email', example: '123e4567-e89b-12d3-a456-426614174000', required: true })
  token: string;
}
