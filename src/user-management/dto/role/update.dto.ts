import { IsNotEmpty, Length } from 'class-validator';

export class UpdateRoleDto {
  @IsNotEmpty()
  @Length(3, 20)
  name: string;
}
