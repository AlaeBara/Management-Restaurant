import {
    Body,
    Controller,
    Delete, Get, Patch, Post, Put,
    Inject,
    Param,
    Query,
    Req,
} from "@nestjs/common";
import {
    ApiBearerAuth,
    ApiOperation,
    ApiTags
} from "@nestjs/swagger";

import { Permissions, Public } from "src/user-management/decorators/auth.decorator";
import { ParseULIDPipe } from "src/common/pipes/parse-ulid.pipe";
import { Guest } from "../entities/guest.entity";
import { CreateGuestDto } from "../dtos/guest/create-guest.dto";
import { UpdateGuestDto } from "../dtos/guest/update-guest.dto";
import { GuestService } from "../services/guest.service";
import { OrderService } from "../services/order.service";
import { CreateOrderDto } from "../dtos/order/create-order.dto";

@Controller('api/orders')
@ApiTags('orders')
@ApiBearerAuth()
export class OrderController {

    constructor(
        @Inject(OrderService)
        private readonly orderService: OrderService
    ) { }


    @Post()
    @Public()
    @ApiOperation({ summary: 'Create a order By Client' })
    async create(@Body() createOrderDto: CreateOrderDto, @Req() req: Request) {
        const order = await this.orderService.createOrder(createOrderDto, req);

        return { message: 'Super! Votre commande a été créée avec succès', status: 201, data: order };
    }
}