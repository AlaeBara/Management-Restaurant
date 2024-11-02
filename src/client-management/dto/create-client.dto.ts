import { IsEmail, IsNotEmpty, Length } from 'class-validator';
import { Gender } from 'src/common/enums/gender.enum';
import { ApiProperty } from '@nestjs/swagger';
export class createClientDto {
  @IsNotEmpty()
  @Length(5, 30)
  @ApiProperty({
    description: 'The username of the client',
    example: 'john_doe',
    required: true,
  })
  username: string;
  @IsNotEmpty()
  @Length(5, 50)
  @ApiProperty({ description: 'The fullname of the client', example: 'John Doe', required: true })
  fullname: string;
  @IsNotEmpty()
  @ApiProperty({ description: 'The gender of the client', example: 'Male', required: true })
  gender: Gender;
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ description: 'The email of the client', example: 'john.doe@example.com', required: true })
  email: string;
  @IsNotEmpty()
  @Length(8, 30)
  @ApiProperty({ description: 'The password of the client', example: 'password123', required: true })
  password: string;
}
