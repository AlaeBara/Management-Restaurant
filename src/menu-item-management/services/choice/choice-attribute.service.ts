import { Injectable } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, QueryRunner, Repository } from "typeorm";

import { GenericService } from "src/common/services/generic.service";
import { ChoiceAttribute } from "../../entities/choices/choice-attribute.entity";
import { CreateChoiceAttributeDto } from "src/menu-item-management/dtos/choices/create-choice-attribute.dto";
import { UpdateChoiceAttributeDto } from "src/menu-item-management/dtos/choices/update-choice-attribute.dto";

@Injectable()
export class ChoiceAttributeService extends GenericService<ChoiceAttribute> {

    constructor(
        @InjectDataSource() dataSource: DataSource,
        @InjectRepository(ChoiceAttribute)
        readonly choiceAttributeRepository: Repository<ChoiceAttribute>,
    ) {
        super(dataSource, ChoiceAttribute, 'choix attribut');
    }

    async inizializeQueryRunner() {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        return queryRunner;
    }

    async createAttribute(createChoiceAttributeDto: CreateChoiceAttributeDto, queryRunnerPassed?: QueryRunner) {
         const queryRunner = queryRunnerPassed || await this.inizializeQueryRunner();
        try {
        await this.validateUnique({
            attribute: createChoiceAttributeDto.attribute,
        });
      
        const choiceAttribute = this.choiceAttributeRepository.create({ ...createChoiceAttributeDto });
        await queryRunner.manager.save(choiceAttribute);
        if (!queryRunnerPassed) await queryRunner.commitTransaction();
        return choiceAttribute;

        } catch (error) {
            if (!queryRunnerPassed) await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            if (!queryRunnerPassed) await queryRunner.release();
        }

    }


    async updateChoiceAttribute(id: string, updateChoiceAttributeDto: UpdateChoiceAttributeDto, queryRunnerPassed?: QueryRunner) {
        const queryRunner = queryRunnerPassed || await this.inizializeQueryRunner();
        try {

        await this.validateUniqueExcludingSelf({
            attribute: updateChoiceAttributeDto.attribute,
        }, id);

        const choiceAttribute = await this.findOneByIdWithOptions(id);
        Object.assign(choiceAttribute, updateChoiceAttributeDto);
        await queryRunner.manager.update(ChoiceAttribute, id, choiceAttribute);
        if (!queryRunnerPassed) await queryRunner.commitTransaction();

        return choiceAttribute;
        } catch (error) {
            if (!queryRunnerPassed) await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            if (!queryRunnerPassed) await queryRunner.release();
        }
    }

}
