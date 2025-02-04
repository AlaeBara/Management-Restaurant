import { Injectable } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";

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

    async createAttribute(createChoiceAttributeDto: CreateChoiceAttributeDto) {
        await this.validateUnique({
            attribute: createChoiceAttributeDto.attribute,
        });
        const choiceAttribute = this.choiceAttributeRepository.create({ ...createChoiceAttributeDto });
        return this.choiceAttributeRepository.save(choiceAttribute);
    }

    async updateChoiceAttribute(id: string, updateChoiceAttributeDto: UpdateChoiceAttributeDto) {
        const choiceAttribute = await this.findOneByIdWithOptions(id);
        Object.assign(choiceAttribute, updateChoiceAttributeDto);
        return this.choiceAttributeRepository.save(choiceAttribute);
    }

}
