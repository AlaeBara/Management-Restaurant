import { DataSource, Repository } from "typeorm";
import { ExpenseType } from "../entities/expense-type.entity";
import { FundOperationEntity } from "../entities/fund-operation.entity";
import { GenericService } from "src/common/services/generic.service";
import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { CreateExpenseTypeDto } from "../dtos/expense-type/create-expense-type.dto";
import { UpdateExpenseTypeDto } from "../dtos/expense-type/update-expense-type.dto";

@Injectable()
export class ExpenseTypeService extends GenericService<ExpenseType> {

    constructor(
        @InjectDataSource() dataSource: DataSource,
        @InjectRepository(ExpenseType)
        readonly expenseTypeRepository: Repository<ExpenseType>,
        @InjectRepository(FundOperationEntity)
        readonly fundOperationRepository: Repository<FundOperationEntity>,
    ) {
        super(dataSource, ExpenseType, 'depense');
    }

    async createExpenseType(createExpenseTypeDto: CreateExpenseTypeDto) {
        await this.validateUnique({
            name: createExpenseTypeDto.name,
        });
        const expenseType = this.expenseTypeRepository.create(createExpenseTypeDto);
        return await this.expenseTypeRepository.save(expenseType);
    }

    async updateExpenseType(id: string, updateExpenseTypeDto: UpdateExpenseTypeDto) {
        await this.validateUniqueExcludingSelf({
            name: updateExpenseTypeDto.name,
        }, id);

        const expenseType = await this.findOneByIdWithOptions(id);

        const isAllowed = await this.allowedToModify(id);
        if (!isAllowed) {
            throw new BadRequestException('Impossible de modifier ce type de dépense car il est lié à des opérations de fonds');
        }

        const object = Object.assign(expenseType, updateExpenseTypeDto);

        return await this.update(id, updateExpenseTypeDto);
    }

    async allowedToModify(id: string): Promise<boolean> {
        const countCalls = await this.fundOperationRepository.count({
            where: {
                expenseType: { id }
            }
        });

        return countCalls === 0;
    }

    async deleteExpenseType(id: string) {
        const isAllowed = await this.allowedToModify(id);
        if (!isAllowed) {
            throw new BadRequestException('Impossible de supprimer ce type de dépense car il est lié à des opérations de fonds');
        }

        await this.findOneByIdWithOptions(id, { findOrThrow: true });

        return await this.softDelete(id);
    }
}