import { ApiTags } from "@nestjs/swagger";
import { Controller } from "@nestjs/common";

@ApiTags('users/verification')
@Controller('api/users/verification')
export default class UserVerificationController {
    //public async sendVerificationEmail(req: Request, res: Response)
    //public async verifyEmail(req: Request, res: Response) 
}
