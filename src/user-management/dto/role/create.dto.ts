import {
  IsNotEmpty,
  Length,
} from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty()
  @Length(3, 20)
  name: string;
}
