import { Body, Controller, Get, Inject, Param, Post, Query, Req } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";

import { OrderService } from "../services/order.service";
import { Permissions } from "src/user-management/decorators/auth.decorator";
import { Order } from "../entities/order.entity";
import { CreateOrderDto } from "../dtos/order/create-order.dto";

@Controller('api/orders')
@ApiTags('orders')
@ApiBearerAuth()
export class OrderController {

    constructor(
        @Inject(OrderService)
        private readonly orderService: OrderService,
    ) { }

    @Get()
    @Permissions('view-order')
    @ApiOperation({ summary: 'Get all orders' })
    async findAll(
        @Query('page') page?: number,
        @Query('limit') limit?: number,
        @Query('relations') relations?: string[],
        @Query('sort') sort?: string,
        @Query('withDeleted') withDeleted?: boolean,
        @Query('onlyDeleted') onlyDeleted?: boolean,
        @Query('select') select?: string[],
        @Query() query?: any,
    ): Promise<{ data: Order[]; total: number; page: number; limit: number }> {
        return this.orderService.findAll(
            page,
            limit,
            relations,
            sort,
            withDeleted,
            onlyDeleted,
            select,
            query,
        );
    }

    @Get(':idOrOrderNumber')
    @Permissions('view-order')
    @ApiOperation({ summary: 'Get a order by id or order number' })
    async getOrder(@Param('idOrOrderNumber') idOrOrderNumber: string) {
        return this.orderService.findOrderByIdOrOrderNumber(idOrOrderNumber);
    }

    @Post()
    @Permissions('manage-order')
    @ApiOperation({ summary: 'Create a new order' })
    async createOrder(@Body() createOrderDto: CreateOrderDto, @Req() req: Request) {
        return this.orderService.createOrderByStaff(createOrderDto, req);
    }
}