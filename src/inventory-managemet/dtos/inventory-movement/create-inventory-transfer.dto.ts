import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsNumber, isNumber, IsOptional, IsString, IsUUID } from "class-validator";
import { MovementType } from "src/inventory-managemet/enums/movement_type.enum";


export class CreateInvenotryTransfer {

    @ApiProperty({ description: 'The Invenetory id of the Movement', required: true , example: '1920feed-7595-438c-aea8-35fe65b6e85c'})
    @IsUUID()
    @IsNotEmpty()
    inventoryId: string;

    @ApiProperty({ description: 'The destination Inventory id of the Movement For Transfert Movement Type', required: true , example: '1920feed-7595-438c-aea8-35fe65b6e85c'})
    @IsUUID()
    @IsNotEmpty()
    transfertToInventoryId: string;   

    @ApiProperty({ description: 'The Quantity of the Movement', required: true , example: 20})
    @IsNumber()
    @IsNotEmpty()
    quantity :number

    @ApiProperty({ description: 'The Movement Type of the Movement', required: true , example: 'INVENTORY_INITIAL'})
    @IsNotEmpty()
    @IsEnum(MovementType)
    movementType: MovementType

    @ApiProperty({ description: 'The Movement Date of the Movement', required: true , example: '2024-11-24 14:00:00'})
    @IsOptional()
    movementDate: Date

    @ApiProperty({ description: 'The Notes of the Movement', required: false , example: 'This is a note'})
    @IsString()
    @IsOptional()
    notes: string | null;

    @ApiProperty({ description: 'The Reason of the Movement', required: false , example: 'This is a reason'})
    @IsString()
    @IsOptional()
    reason: string | null;
}