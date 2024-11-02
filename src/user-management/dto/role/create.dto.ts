import {
  IsNotEmpty,
  Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateRoleDto {
  @IsNotEmpty()
  @Length(3, 20)
  @ApiProperty({ description: 'The name of the role', example: 'admin', required: true })
  name: string;
}
