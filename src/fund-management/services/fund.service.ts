import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { GenericService } from "src/common/services/generic.service";
import { Fund } from "../entities/fund.entity";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { CreateFundDto } from "../dtos/fund/create-fund.dto";
import { UpdateFundDto } from "../dtos/fund/update-fund.dto";
import { FundOperation } from "../enums/fund-operation.enum";
import { FundOperationService } from "./fund-operation.service";
import { FundOperationEntity } from "../entities/fund-operation.entity";

@Injectable()
export class FundService extends GenericService<Fund> {

    constructor(
        @InjectDataSource() dataSource: DataSource,
        @InjectRepository(Fund)
        readonly fundRepository: Repository<Fund>,
        @InjectRepository(FundOperationEntity)
        readonly fundOperationRepository: Repository<FundOperationEntity>,
    ) {
        super(dataSource, Fund, 'funds');
    }

    async createFund(createFundDto: CreateFundDto) {

        const fund = this.fundRepository.create(createFundDto);

        await this.validateUnique({
            sku: fund.sku,
            name: fund.name,
        });

        return await this.fundRepository.save(fund);
    }

    async updateFund(id: string, updateFundDto: UpdateFundDto) {
        const rawFund = await this.findOneByIdWithOptions(id);

        const fund = this.fundRepository.create(updateFundDto);

        await this.validateUniqueExcludingSelf({
            sku: fund.sku,
            name: fund.name,
        }, id);

        Object.assign(rawFund, fund);

        return await this.fundRepository.save(rawFund);
    }

    async deleteFund(id: string) {
        const operations = await this.fundOperationRepository.count({
            where: [{ fund: { id } },
            { transferToFund: { id } },
            ],
            withDeleted: false,
        })
        if (operations > 0) throw new BadRequestException('Vous ne pouvez pas supprimer un fonds qui a des transactions');
        return await this.fundRepository.softDelete(id);
    }
}
