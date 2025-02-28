import {
    Body,
    Controller,
    Delete, Get, Patch, Post, Put,
    Inject,
    Param,
    Query,
} from "@nestjs/common";
import {
    ApiBearerAuth,
    ApiOperation,
    ApiTags
} from "@nestjs/swagger";

import { PaymentMethodService } from "../services/payment-method.service";
import { Permissions } from "src/user-management/decorators/auth.decorator";
import { PaymentMethod } from "../entities/payment-method.entity";
import { ParseULIDPipe } from "src/common/pipes/parse-ulid.pipe";
import { CreatePaymentMethodDto } from "../dtos/create-payment-method.dto";
import { UpdatePaymentMethodDto } from "../dtos/update-payment-method.dto";

@Controller('api/payment-methods')
@ApiTags('payment-methods')
@ApiBearerAuth()
export class PaymentMethodController {

    constructor(
        @Inject(PaymentMethodService)
        private readonly paymentMethodService: PaymentMethodService
    ) { }

    @Get()
    @Permissions('view-payment-method')
    @ApiOperation({ summary: 'Get all payment methods' })
    async findAll(
        @Query('page') page?: number,
        @Query('limit') limit?: number,
        @Query('relations') relations?: string[],
        @Query('sort') sort?: string,
        @Query('withDeleted') withDeleted?: boolean,
        @Query('onlyDeleted') onlyDeleted?: boolean,
        @Query('select') select?: string[],
        @Query() query?: any,
    ): Promise<{ data: PaymentMethod[]; total: number; page: number; limit: number }> {
        return this.paymentMethodService.findAll(
            page,
            limit,
            relations,
            sort,
            withDeleted,
            onlyDeleted,
            select,
            query
        );
    }

    @Get(':id')
    @Permissions('view-payment-method')
    @ApiOperation({ summary: 'Get a payment method by id' })
    async findOne(
        @Param('id', ParseULIDPipe) id: string,
        @Query('withDeleted') withDeleted?: boolean,
        @Query('relations') relations?: string[],
        @Query('onlyDeleted') onlyDeleted?: boolean,
        @Query('select') select?: string[],
        @Query('findOrThrow') findOrThrow?: boolean,
    ): Promise<PaymentMethod> {
        return this.paymentMethodService.findOneWithoutBuilder(id, {
            relations,
            select,
            withDeleted,
            onlyDeleted,
            findOrThrow,
        });
    }

    @Post()
    @Permissions('manage-payment-method')
    @ApiOperation({ summary: 'Create a payment method' })
    async create(@Body() createPaymentMethodDto: CreatePaymentMethodDto) {
        await this.paymentMethodService.createPaymentMethod(createPaymentMethodDto);

        return { message: 'Super! Votre mode de paiement a été créé avec succès', status: 201 };
    }

    @Put(':id')
    @Permissions('manage-payment-method')
    @ApiOperation({ summary: 'Update a payment method' })
    async update(@Param('id', ParseULIDPipe) id: string, @Body() updatePaymentMethodDto: UpdatePaymentMethodDto) {
        await this.paymentMethodService.updatePaymentMethod(id, updatePaymentMethodDto);

        return { message: 'Super! Votre mode de paiement a été modifié avec succès', status: 200 };
    }

    @Delete(':id')
    @Permissions('manage-payment-method')
    @ApiOperation({ summary: 'Delete a payment method' })
    async delete(@Param('id', ParseULIDPipe) id: string) {
        await this.paymentMethodService.deletePaymentMethod(id);

        return { message: 'Super! Votre mode de paiement a été supprimé avec succès', status: 200 };
    }

    @Patch(':id/restore')
    @Permissions('manage-payment-method')
    @ApiOperation({ summary: 'Restore a payment method' })
    async restore(@Param('id', ParseULIDPipe) id: string) {
        await this.paymentMethodService.restoreByUUID(id, true, ['paymentMethod']);

        return { message: 'Super! Votre mode de paiement a été restauré avec succès', status: 200 };
    }
}
