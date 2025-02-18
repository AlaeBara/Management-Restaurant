import {
    Body,
    Controller,
    Delete, Get, Patch, Post, Put,
    Inject,
    Param,
    Query
} from "@nestjs/common";
import {
    ApiBearerAuth,
    ApiOperation,
    ApiTags
} from "@nestjs/swagger";

import { OrderService } from "../services/order.service";
import { Permissions } from "src/user-management/decorators/auth.decorator";
import { Order } from "../entities/order.entity";
import { ParseULIDPipe } from "src/common/pipes/parse-ulid.pipe";

@Controller('api/orders')
@ApiTags('orders')
@ApiBearerAuth()
export class OrderController {

    constructor(
        @Inject(OrderService)
        private readonly orderService: OrderService
    ) { }

    @Get()
    @Permissions('read-order')
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

    @Get(':id')
    @Permissions('read-order')
    @ApiOperation({ summary: 'Get a order by id' })
    async getOrder(@Param('id', ParseULIDPipe) id: string) {
        return this.orderService.findOneWithoutBuilder(id);
    }
}