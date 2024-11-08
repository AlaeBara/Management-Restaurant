import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePasswordDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'The old password of the user', example: 'oldPassword123' })
  oldPassword: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'The new password of the user', example: 'newPassword123' })
  newPassword: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Confirm the new password', example: 'newPassword123' })
  confirmPassword: string;
}

export class AdminUpdatePasswordDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'New password set by admin', example: 'newPassword123' })
  password: string;
}