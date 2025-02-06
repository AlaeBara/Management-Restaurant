import { BadRequestException, Inject, Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, QueryRunner, Repository } from "typeorm";

import { GenericService } from "src/common/services/generic.service";
import { Choice } from "src/menu-item-management/entities/choices/choice.entity";
import { UpdateChoiceDto } from "src/menu-item-management/dtos/choices/update-choice.dto";
import { CreateChoiceDto } from "src/menu-item-management/dtos/choices/create-choice.dto";
import { ChoiceAttributeService } from "./choice-attribute.service";
import { CreateBatchChoiceDto } from "src/menu-item-management/dtos/choices/create-batch-choice.dto";
import logger from "src/common/Loggers/logger";
import { CreateAttributeWithChoicesDto } from "src/menu-item-management/dtos/choices/create-attribute-choices.dto";
import { ChoiceAttribute } from "src/menu-item-management/entities/choices/choice-attribute.entity";

@Injectable()
export class ChoiceService extends GenericService<Choice> {

    constructor(
        @InjectDataSource() dataSource: DataSource,
        @InjectRepository(Choice)
        readonly choiceRepository: Repository<Choice>,
        @Inject(ChoiceAttributeService)
        readonly choiceAttributeService: ChoiceAttributeService,
    ) {
        super(dataSource, Choice, 'choix');
    }

    async inizializeQueryRunner() {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        return queryRunner;
    }

    async createChoice(createChoiceDto: CreateChoiceDto) {
        await this.validateUnique({
            value: createChoiceDto.value,
        });
        const choiceAttribute = await this.choiceAttributeService.findOneByIdWithOptions(createChoiceDto.attributeId);
        const choice = this.choiceRepository.create({ ...createChoiceDto, attribute: choiceAttribute });
        return this.choiceRepository.save(choice);
    }

    async updateChoice(id: string, updateChoiceDto: UpdateChoiceDto) {
        const choice = await this.findOneByIdWithOptions(id, { relations: ['attribute'] });
        if (updateChoiceDto.attributeId && choice.attribute.id !== updateChoiceDto.attributeId) {
            const choiceAttribute = await this.choiceAttributeService.findOneByIdWithOptions(updateChoiceDto.attributeId);
            Object.assign(choice, { ...updateChoiceDto, attribute: choiceAttribute });
        }
        Object.assign(choice, updateChoiceDto);
        return this.choiceRepository.save(choice);
    }

    async createBatch(choiceAttribute: ChoiceAttribute, createBatchChoiceDto: CreateBatchChoiceDto, queryRunnerPassed?: QueryRunner) {
        const queryRunner = queryRunnerPassed || await this.inizializeQueryRunner();
        try {
           
            const choices = [];
            for (const value of createBatchChoiceDto.values) {
                await this.validateUnique({ value: value });
                const choice = this.choiceRepository.create({ value: value, attribute: choiceAttribute });
                choices.push(choice);
            }
            await queryRunner.manager.save(Choice, choices);
            if (!queryRunnerPassed) await queryRunner.commitTransaction();
        } catch (error) {
            if (!queryRunnerPassed) await queryRunner.rollbackTransaction();
            logger.warn('Error while creating batch of choices:', { message: error.message, stack: error.stack });
            throw new BadRequestException(error.message);


        } finally {
            if (!queryRunnerPassed) await queryRunner.release();
        }
    }


    async createAttributeWithChoices(createAttributeWithChoicesDto: CreateAttributeWithChoicesDto) {
        const queryRunner = await this.inizializeQueryRunner();
        try {
            const choiceAttribute = await this.choiceAttributeService.createAttribute(createAttributeWithChoicesDto, queryRunner);
            await this.createBatch(choiceAttribute, { values: createAttributeWithChoicesDto.choices }, queryRunner);
            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            logger.error('Error creating attribute with choices:', { message: error.message, stack: error.stack });
            throw new InternalServerErrorException('Une erreur est survenue lors de l\'action. Veuillez réessayer plus tard.');
        } finally {
            await queryRunner.release();
        }
    }
}
