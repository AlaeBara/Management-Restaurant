import {
  IsNotEmpty,
  IsOptional,
  Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateRoleDto {
  @IsNotEmpty()
  @Length(3, 20)
  @ApiProperty({ description: 'The name of the role', example: 'admin', required: true })
  name: string;

  @IsOptional()
  @ApiProperty({ description: 'The label of the role', example: 'Accès administratif et gestion', required: false })
  label: string;
}
