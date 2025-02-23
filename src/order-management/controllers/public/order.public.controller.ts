import { Body, Controller, Get, Inject, Param, Post, Req } from "@nestjs/common";
import {
    ApiBearerAuth,
    ApiOperation,
    ApiTags
} from "@nestjs/swagger";

import { Public } from "src/user-management/decorators/auth.decorator";
import { CreateOrderDto } from "../../dtos/order/create-order.dto";
import { OrderPublicService } from "src/order-management/services/public/order.public.service";
import { PublicCreateOrderDto } from "src/order-management/dtos/public/order/create-order.public.dto";

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
    async create(@Body() createOrderDto: PublicCreateOrderDto, @Req() req: Request) {
        const orderNumber = await this.orderService.createOrderByClient(createOrderDto, req);
        return { message: 'Super! Votre commande a été créée avec succès', status: 201, orderNumber: orderNumber };
    }

    @Get(':idOrOrderNumber')
    @Public()
    @ApiOperation({ summary: 'Get a order by id or order number' })
    async getOrder(@Param('idOrOrderNumber') idOrOrderNumber: string) {
        return this.orderService.findOrderByIdOrOrderNumber(idOrOrderNumber);
    }
}
