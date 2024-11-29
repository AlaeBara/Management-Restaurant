import { Injectable } from "@nestjs/common";
import { GenericService } from "src/common/services/generic.service";
import { Fund } from "../entities/fund.entity";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { CreateFundDto } from "../dtos/fund/create-fund.dto";
import { UpdateFundDto } from "../dtos/fund/update-fund.dto";
import { FundOperation } from "../enums/fund-operation.enum";

@Injectable()
export class FundService extends GenericService<Fund> {

    constructor(
        @InjectDataSource() dataSource: DataSource,
        @InjectRepository(Fund)
        readonly fundRepository: Repository<Fund>,
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
        return await this.fundRepository.softDelete(id);
    }
}
