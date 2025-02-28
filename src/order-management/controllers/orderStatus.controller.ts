import { Inject, Param, Put, Req } from "@nestjs/common";
import { Controller } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Permissions } from "src/user-management/decorators/auth.decorator";
import { OrderStatusService } from "../services/order-status.service";

@Controller('api/orders-status')
@ApiTags('orders-status')
@ApiBearerAuth()
export class OrderStatusController {

    constructor(
        @Inject(OrderStatusService)
        private readonly orderStatusService: OrderStatusService
    ) { }

    @Put(':orderId/validate')
    @Permissions('manage-order')
    @ApiOperation({ summary: 'validate Order' })
    async validateOrder(@Param('orderId') orderId: string, @Req() req: Request) {
        return this.orderStatusService.validateOrder(orderId, req);
    }
}
