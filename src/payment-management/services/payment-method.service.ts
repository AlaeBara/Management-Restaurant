
import {
    InjectDataSource,
    InjectRepository
} from "@nestjs/typeorm";
import {
    DataSource,
    Repository
} from "typeorm";

import { PaymentMethod } from "../entities/payment-method.entity";
import { GenericService } from "src/common/services/generic.service";
import { CreatePaymentMethodDto } from "../dtos/create-payment-method.dto";
import { UpdatePaymentMethodDto } from "../dtos/update-payment-method.dto";
import { BadRequestException, NotFoundException } from "@nestjs/common";

export class PaymentMethodService extends GenericService<PaymentMethod> {

    constructor(
        @InjectDataSource() dataSource: DataSource,
        @InjectRepository(PaymentMethod)
        private paymentMethodRepository: Repository<PaymentMethod>,
    ) {
        super(dataSource, PaymentMethod, 'mode de paiement');
    }

    async createPaymentMethod(createPaymentMethodDto: CreatePaymentMethodDto) {
        const paymentMethod = this.paymentMethodRepository.create(createPaymentMethodDto);

        await this.validateUnique({
            name: paymentMethod.name,
        });

        return this.paymentMethodRepository.save(paymentMethod);
    }

    async updatePaymentMethod(id: string, updatePaymentMethodDto: UpdatePaymentMethodDto) {
        const paymentMethod = await this.findOneByIdWithOptions(id);

        await this.throwIfProtected(paymentMethod);

        await this.validateUniqueExcludingSelf({
            name: updatePaymentMethodDto.name,
        }, id);

        return this.paymentMethodRepository.save({ ...paymentMethod, ...updatePaymentMethodDto });
    }

    async deletePaymentMethod(id: string) {
        const paymentMethod = await this.findOneByIdWithOptions(id);

        await this.throwIfProtected(paymentMethod);

        return this.softDelete(id);
    }

    private async throwIfProtected(paymentMethod: PaymentMethod) {
        if (paymentMethod.protected) {
            throw new BadRequestException('Impossible de modifier/supprimer un mode de paiement protégé');
        }
    }
}
