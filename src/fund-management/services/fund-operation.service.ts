import { GenericService } from "src/common/services/generic.service";
import { FundOperationEntity } from "../entities/fund-operation.entity";
import { DataSource, Repository } from "typeorm";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { CreateFundOperationDto } from "../dtos/fund-operation/create-fund-operation.dto";
import { FundService } from "./fund.service";
import { FundOperation, FundOperationStatus, getOperationAction } from "../enums/fund-operation.enum";
import { Fund } from "../entities/fund.entity";
import { CreateExpenseDto } from "../dtos/fund-operation/create-expense.dto";

@Injectable()
export class FundOperationService extends GenericService<FundOperationEntity> {

    constructor(
        @InjectDataSource() dataSource: DataSource,
        @InjectRepository(FundOperationEntity)
        readonly fundOperationRepository: Repository<FundOperationEntity>,
        @Inject(FundService)
        private readonly fundService: FundService,
    ) {
        super(dataSource, FundOperationEntity, 'fund_operations');
    }

    async validateFund(fundId: string, operation: FundOperationEntity): Promise<Fund> {
        const fund = await this.fundService.findOrThrowByUUID(fundId);
        if (!fund.isActive) throw new BadRequestException('Fund is not active');
        operation.fund = fund;
        fund.balance = Number(fund.balance);
        return fund;
    }

    async validateOperation(operation: FundOperationEntity): Promise<void> {
        if (!operation) throw new BadRequestException('Invalid operation');
    }

    async validateAmount(amount: number): Promise<void> {
        if (amount <= 0) throw new BadRequestException('Amount must be greater than 0');
    }

    async validateBalance(fund: Fund, amount: number, operation: FundOperation): Promise<void> {
        const opeationAction = getOperationAction(operation);
        if (opeationAction === 'decrease' && fund.balance - amount < 0) throw new BadRequestException('Insufficient balance');
    }

    async adjustFundBalance(fund: Fund, amount: number, operation: FundOperation): Promise<void> {
        fund.balance = parseFloat(String(fund.balance));
        amount = parseFloat(String(amount));
        const operationAction = getOperationAction(operation);
        switch (operationAction) {
            case 'increase':
                fund.balance += amount;
                break;
            case 'decrease':
                fund.balance -= amount;
                break;
        }
        await this.fundService.updateFund(fund.id, fund);
    }

    private async processOperation(
        operationData: CreateFundOperationDto | CreateExpenseDto,
        operationType?: FundOperation
    ): Promise<FundOperationEntity> {
        const fundOperation = this.fundOperationRepository.create(operationData);
        await this.validateOperation(fundOperation);
        await this.validateAmount(fundOperation.amount);
        if (operationType) fundOperation.operation = operationType;
        const fund = await this.validateFund(operationData.fundId, fundOperation);
        if (fundOperation.status && fundOperation.status === FundOperationStatus.APPROVED) {
            await this.validateBalance(fund, fundOperation.amount, fundOperation.operation);
            await this.adjustFundBalance(fund, fundOperation.amount, fundOperation.operation);
        }
        return this.fundOperationRepository.save(fundOperation);
    }

    async createOperation(createFundOperationDto: CreateFundOperationDto): Promise<FundOperationEntity> {
        return this.processOperation(createFundOperationDto);
    }

    async createExpense(createExpenseDto: CreateExpenseDto): Promise<FundOperationEntity> {
        return this.processOperation(createExpenseDto, FundOperation.EXPENSE);
    }

    async approveOperation(operationId: string): Promise<FundOperationEntity> {
        const operation = await this.findOrThrowByUUID(operationId);
        if (operation.status && operation.status === FundOperationStatus.APPROVED) throw new BadRequestException('Operation already approved');
        await this.validateBalance(operation.fund, operation.amount, operation.operation);
        await this.adjustFundBalance(operation.fund, operation.amount, operation.operation);
        operation.status = FundOperationStatus.APPROVED;
        operation.approvedAt = new Date();
        return this.fundOperationRepository.save(operation);
    }
}