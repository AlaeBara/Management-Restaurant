import { IsEnum } from "class-validator";
import { UserStatus } from "src/user-management/enums/user-status.enum";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateStatusDto {
  @IsEnum(UserStatus)
  @ApiProperty({ description: 'The status of the user', example: 'active', required: true })
  status: UserStatus;
}

