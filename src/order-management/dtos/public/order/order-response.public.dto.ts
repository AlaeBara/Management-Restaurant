import { Expose, Transform } from "class-transformer";
import { IsNotEmpty } from "class-validator";
import { IsString } from "class-validator";
import { Table } from "typeorm";
import { Exclude } from "class-transformer";
import { getLabelDeliveryType } from "src/order-management/enums/order-type.enum";
import { getLabelServiceType } from "src/order-management/enums/service-type.enum";
import { getLabelOrderStatus } from "src/order-management/enums/order-status.enum";
import { getLabelPaymentStatus } from "src/order-management/enums/payment-status.enum";

@Exclude()
export class OrderTableResponsePublicDto {
    @Expose()
    id: string;

    @Expose()
    tableName: string;

    @Expose()
    qrcode: string;
}
@Exclude()
export class OrderItemsResponsePublicDto {
    @Expose()
    id: string;

    @Expose()
    fullLabel: string;

    @Expose()
    @Transform(({ value }) => Number(value))
    price: number;

    @Expose()
    @Transform(({ value }) => Number(value))
    quantity: number;

    @Expose()
    @Transform(({ value }) => Number(value))
    total: number;
}

@Exclude()
export class OrderResponsePublicDto {
    @Expose()
    id: string;

    @Expose()
    orderNumber: string;

    @Expose()
    numberOfSeats: number;

    @Expose()
    @Transform(({ value }) => getLabelDeliveryType(Number(value)))
    deliveryType: string;

    @Expose()
    @Transform(({ value }) => getLabelServiceType(Number(value)))
    serviceType: string;

    @Expose()
    @Transform(({ value }) => getLabelOrderStatus(Number(value)))
    orderStatus: string;

    @Expose()
    totalAmount: number;

    @Expose()
    note: string;
    
    @Expose()
    @Transform(({ value }) => getLabelPaymentStatus(Number(value)))
    paymentStatus: string;

    @Expose()
    orderItems: OrderItemsResponsePublicDto;
    
    @Expose()
    table: OrderTableResponsePublicDto;
}

