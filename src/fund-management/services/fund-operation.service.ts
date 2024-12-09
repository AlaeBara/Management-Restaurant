import { GenericService } from "src/common/services/generic.service";
import { FundOperationEntity } from "../entities/fund-operation.entity";
import { DataSource, Repository } from "typeorm";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { BadRequestException, Inject, Injectable, NotFoundException, Req } from "@nestjs/common";
import { CreateFundOperationDto } from "../dtos/fund-operation/create-fund-operation.dto";
import { FundService } from "./fund.service";
import { FundOperation, FundOperationStatus, getOperationAction } from "../enums/fund-operation.enum";
import { Fund } from "../entities/fund.entity";
import { CreateExpenseDto } from "../dtos/fund-operation/create-expense.dto";
import { CreateTransferOperationDto } from "../dtos/fund-operation/create-transfer-operation.dto";
import { UserService } from "src/user-management/services/user/user.service";

@Injectable()
export class FundOperationService extends GenericService<FundOperationEntity> {

    constructor(
        @InjectDataSource() dataSource: DataSource,
        @InjectRepository(FundOperationEntity)
        readonly fundOperationRepository: Repository<FundOperationEntity>,
        @Inject(FundService)
        private readonly fundService: FundService,
        @Inject(UserService)
        private readonly userService: UserService,
    ) {
        super(dataSource, FundOperationEntity, 'fund_operations');
    }

    async createOperation(createFundOperationDto: CreateFundOperationDto, @Req() req: Request): Promise<FundOperationEntity> {
        return this.processOperation(createFundOperationDto, req);
    }

    async createExpense(createExpenseDto: CreateExpenseDto, @Req() req: Request): Promise<FundOperationEntity> {
        return this.processOperation(createExpenseDto, req, FundOperation.EXPENSE);
    }

    async approveOperation(operationId: string, @Req() req: Request): Promise<FundOperationEntity> {
        const operation = await this.findOrThrowByUUID(operationId);
        if (operation.status && operation.status === FundOperationStatus.APPROVED) throw new BadRequestException('Opération déjà approuvée');
        await this.validateBalance(operation.fund, operation.amount, operation.operation);
        await this.adjustFundBalance(operation.fund, operation.amount, operation.operation);
        operation.status = FundOperationStatus.APPROVED;
        await this.AssignUserOperation(req['user'].sub, operation, 'approvedBy');
        operation.approvedAt = new Date();
        return this.fundOperationRepository.save(operation);
    }

    async trasfertOperation(operationDto: CreateTransferOperationDto, @Req() req: Request): Promise<FundOperationEntity> {
        const operation = await this.generateTransfer(operationDto);

        await this.validateAmount(operation.amount);

        if (operation.status == FundOperationStatus.APPROVED) {
            await this.finalizeTransfer(operation, req);
        }
        await this.AssignUserOperation(req['user'].sub, operation, 'createdBy');
        return this.fundOperationRepository.save(operation);
    }

    async approveTransferOperation(operationId: string, @Req() req: Request): Promise<FundOperationEntity> {
        const operation = await this.findOrThrowByUUID(operationId);
        if (operation.status && operation.status === FundOperationStatus.APPROVED) throw new BadRequestException('Opération déjà approuvée');
        await this.finalizeTransfer(operation, req);
        operation.status = FundOperationStatus.APPROVED;
        return this.fundOperationRepository.save(operation);
    }

    async deleteOperation(operationId: string){
        const operation = await this.findOrThrowByUUID(operationId);
        if (operation.status && operation.status === FundOperationStatus.APPROVED) throw new BadRequestException('Opération déjà approuvée');
        return this.fundOperationRepository.softDelete(operationId);
    }   

    async AssignUserOperation(userId: string, operation: FundOperationEntity, assignTo: 'createdBy' | 'approvedBy') {
        const User = await this.userService.findOneByIdWithOptions(userId);
        operation[assignTo] = User;
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
        @Req() req: Request,
        operationType?: FundOperation,
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
        await this.AssignUserOperation(req['user'].sub, fundOperation, 'createdBy');
        return this.fundOperationRepository.save(fundOperation);
    }

    async generateTransfer(operationDto: CreateTransferOperationDto) {
        if (operationDto.fundId === operationDto.transferFundId) throw new BadRequestException('Vous ne pouvez pas effectuer un virement vers le même fonds');

        const fund = await this.fundService.findOneByIdWithOptions(operationDto.fundId)
        const transferFund = await this.fundService.findOneByIdWithOptions(operationDto.transferFundId)
        const operation = this.fundOperationRepository.create(operationDto);

        operation.fund = fund;
        operation.transferToFund = transferFund;
        operation.operation = FundOperation.TRANSFER;
        operation.status = operationDto.status ? operationDto.status : FundOperationStatus.PENDING;
        return operation
    }

    async finalizeTransfer(operation: FundOperationEntity, @Req() req: Request) {
        operation.approvedAt = new Date();
        await this.validateBalance(operation.fund, operation.amount, FundOperation.TRANSFER_DECREASE);
        await this.adjustFundBalance(operation.fund, operation.amount, FundOperation.TRANSFER_DECREASE);
        await this.adjustFundBalance(operation.transferToFund, operation.amount, FundOperation.TRANSFER_INCREASE);
        await this.AssignUserOperation(req['user'].sub, operation, 'approvedBy');
    }
}