import {
  IsEmail,
  isEmpty,
  IsEnum,
  IsNotEmpty,
  IsString,
  Length,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @Length(5, 20)
  name: string;
}
