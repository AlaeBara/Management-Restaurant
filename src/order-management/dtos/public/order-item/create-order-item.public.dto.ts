import { IsString, IsNumber, IsOptional, IsUUID, Min, IsDecimal, IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsULID } from 'src/common/decorators/is-ulid.decorator';
import { OrderItemType } from 'src/order-management/enums/order-item-type.enum';
import { Transform } from 'class-transformer';

export class PublicCreateOrderItemDto {

    @ApiPropertyOptional({ description: 'Full label of the order item' })
    @IsOptional()
    @IsString()
    fullLabel?: string;

    @ApiProperty({ description: 'The ID of the associated menu item' })
    @IsUUID()
    productId: string;

    @ApiProperty({ description: 'Type of the item' })
    @Transform(({ value }) => Number(value))
    @IsEnum(OrderItemType)
    type: OrderItemType;


    @ApiProperty({ description: 'Price of the item' })
    @IsNumber({ maxDecimalPlaces: 2 })
    @IsOptional()
    price?: number;

    @ApiProperty({ description: 'Quantity of items' })
    @IsNumber()
    @Min(1)
    quantity: number;

    @ApiProperty({ description: 'Total price for the items' })
    @IsNumber({ maxDecimalPlaces: 2 })
    total: number;
}