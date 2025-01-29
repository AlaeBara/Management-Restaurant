import { IsNotEmpty } from "class-validator";


export class CreateMenuItemImageDto {
    @IsNotEmpty()
    images: Express.Multer.File;
}
