import { IsOptional } from "class-validator";


export class CreateMenuItemImageDto {
    @IsOptional()
    images: Express.Multer.File;
}
