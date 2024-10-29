import { IsNotEmpty } from "class-validator";
import { Zone } from "../../entities/zone.entity";


export class CreateTableDto {

    @IsNotEmpty()
    tableName: string;

    @IsNotEmpty()
    tableCode: string;

    @IsNotEmpty()
    zoneId: number;
}
