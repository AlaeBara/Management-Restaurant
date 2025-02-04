import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { MenuItemChoices } from "../entities/choices/menu-item-choices.entity";
import { MenuItem } from "../entities/menu-item.entity";
import { GenericService } from "src/common/services/generic.service";
import { Injectable } from "@nestjs/common";
import { Choice } from "../entities/choices/choice.entity";
import { ChoiceAttribute } from "../entities/choices/choice-attribute.entity";
import { CreateChoiceAttributeDto } from "../dtos/choices/create-choice-attribute.dto";


@Injectable()
export class MenuItemChoiceService extends GenericService<MenuItemChoices> {

    constructor(
        @InjectDataSource() dataSource: DataSource,
        @InjectRepository(MenuItemChoices)
        readonly menuItemChoiceRepository: Repository<MenuItemChoices>,
        @InjectRepository(Choice)
        readonly choiceRepository: Repository<Choice>,
        @InjectRepository(ChoiceAttribute)
        readonly choiceAttributeRepository: Repository<ChoiceAttribute>,
        @InjectRepository(MenuItem)
        readonly menuItemRepository: Repository<MenuItem>,
    ) {
        super(dataSource, MenuItemChoices, 'choice');
    }


    async createAttribute(createChoiceAttributeDto: CreateChoiceAttributeDto) {
        const choiceAttribute = this.choiceAttributeRepository.create({ ...createChoiceAttributeDto });
        return this.choiceAttributeRepository.save(choiceAttribute);
    }

}
