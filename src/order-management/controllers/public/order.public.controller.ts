import { Body, Controller, Inject, Post, Req } from "@nestjs/common";
import {
    ApiBearerAuth,
    ApiOperation,
    ApiTags
} from "@nestjs/swagger";

import { Public } from "src/user-management/decorators/auth.decorator";
import { CreateOrderDto } from "../../dtos/order/create-order.dto";
import { OrderPublicService } from "src/order-management/services/public/order.public.service";

@Controller('api/orders/public')
@ApiTags('orders')
@ApiBearerAuth()
export class OrderPublicController {

    constructor(
        @Inject(OrderPublicService)
        private readonly orderService: OrderPublicService
    ) { }

    @Post()
    @Public()
    @ApiOperation({ summary: 'Create a order By Client' })
    async create(@Body() createOrderDto: CreateOrderDto, @Req() req: Request) {
        const orderNumber = await this.orderService.createOrder(createOrderDto, req);
        return { message: 'Super! Votre commande a été créée avec succès', status: 201, orderNumber: orderNumber };
    }
}
