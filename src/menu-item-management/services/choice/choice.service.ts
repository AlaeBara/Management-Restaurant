import { BadRequestException, forwardRef, Inject, Injectable, InternalServerErrorException } from "@nestjs/common";
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
import { UpdateAttributeWithChoicesDto } from "src/menu-item-management/dtos/choices/update-attribute-choices.dto";
import { MenuItemChoiceService } from "../menu-item-choice.service";

@Injectable()
export class ChoiceService extends GenericService<Choice> {

    constructor(
        @InjectDataSource() dataSource: DataSource,
        @InjectRepository(Choice)
        readonly choiceRepository: Repository<Choice>,
        @Inject(ChoiceAttributeService)
        readonly choiceAttributeService: ChoiceAttributeService,
        @Inject(forwardRef(() => MenuItemChoiceService))
        readonly menuItemChoiceService: MenuItemChoiceService,
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

    async updateChoice(id: string, updateChoiceDto: UpdateChoiceDto, queryRunnerPassed?: QueryRunner) {
        const queryRunner = queryRunnerPassed || await this.inizializeQueryRunner();
        try {
            const choice = await this.findOneByIdWithOptions(id, { relations: ['attribute'] });

            if (updateChoiceDto.attributeId && choice.attribute.id !== updateChoiceDto.attributeId) {
                const choiceAttribute = await this.choiceAttributeService.findOneByIdWithOptions(updateChoiceDto.attributeId);
                Object.assign(choice, { ...updateChoiceDto, attribute: choiceAttribute });
            } else {
                Object.assign(choice, updateChoiceDto);
            }
            const updatedChoice = await queryRunner.manager.update(Choice, id, choice);
            if (!queryRunnerPassed) await queryRunner.commitTransaction();
            return updatedChoice;
        } catch (error) {
            if (!queryRunnerPassed) await queryRunner.rollbackTransaction();
            logger.warn('Error while updating choice:', { message: error.message, stack: error.stack });

            throw new BadRequestException(error.message);
        } finally {
            if (!queryRunnerPassed) await queryRunner.release();
        }
    }

    async createBatch(choiceAttribute: ChoiceAttribute, createBatchChoiceDto: CreateBatchChoiceDto, queryRunnerPassed?: QueryRunner) {
        const queryRunner = queryRunnerPassed || await this.inizializeQueryRunner();
        try {

            const choices = [];
            for (const value of createBatchChoiceDto.values) {
                if (!queryRunnerPassed) await this.validateUnique({ value: value, attribute: choiceAttribute }, queryRunner);
                const choice = queryRunner.manager.create(Choice, { value: value, attribute: choiceAttribute });
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
            throw new InternalServerErrorException(error.message);
        } finally {
            await queryRunner.release();
        }

    }

    async updateAttributeWithChoices(attributeId: string, updateDto: UpdateAttributeWithChoicesDto) {
        const queryRunner = await this.inizializeQueryRunner();
        try {
            // Update the attribute name
            const choiceAttribute = await this.choiceAttributeService.choiceAttributeRepository.findOne({ where: { id: attributeId }, relations: ['choices'] });
    

            if (choiceAttribute.attribute !== updateDto.attribute) {
                await this.choiceAttributeService.validateUniqueExcludingSelf({
                    attribute: updateDto.attribute,
                }, attributeId);
    
                await queryRunner.manager.update(ChoiceAttribute, attributeId, {
                    attribute: updateDto.attribute
                });
            }
    
            // Get existing choices
            const existingChoices = choiceAttribute.choices || [];
            const existingValues = new Set(existingChoices.map(choice => choice.value));
            const newValues = new Set(updateDto.choices);
    
            // Find choices to delete (exist in DB but not in updateDto)
            const choicesToDelete = existingChoices.filter(choice => !newValues.has(choice.value));
            if (choicesToDelete.length > 0) {
                for (const choice of choicesToDelete) {
                    if (await this.isChoiceLinkedToMenuItem(choice.id)) {
                        throw new BadRequestException('Un élément de menu est lié à un choix en cours de suppression');
                    }
                }
                await queryRunner.manager.delete(Choice, choicesToDelete.map(c => c.id));
            }
    
            // Find values to add (exist in updateDto but not in DB)
            const valuesToAdd = updateDto.choices.filter(value => !existingValues.has(value));
            if (valuesToAdd.length > 0) {
                await this.createBatch(choiceAttribute, { values: valuesToAdd }, queryRunner);
            }
    
            await queryRunner.commitTransaction();
            return choiceAttribute;
    
        } catch (error) {
            await queryRunner.rollbackTransaction();
            logger.error('Error updating attribute with choices:', { message: error.message, stack: error.stack });
            throw new InternalServerErrorException(error.message);
        } finally {
            await queryRunner.release();
        }
    }

    async isChoiceLinkedToMenuItem(choiceId: string) {
        const count = await this.menuItemChoiceService.countMenuItemByChoiceId(choiceId);
        return count > 0;
    }
}

