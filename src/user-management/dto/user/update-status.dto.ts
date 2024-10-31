import { IsEnum } from "class-validator";
import { UserStatus } from "src/user-management/enums/user-status.enum";


export class UpdateStatusDto {
  @IsEnum(UserStatus)
  status: UserStatus;
}

