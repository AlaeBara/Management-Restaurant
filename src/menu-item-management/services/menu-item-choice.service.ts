import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { MenuItemChoices } from "../entities/choices/menu-item-choices.entity";
import { MenuItem } from "../entities/menu-item.entity";
import { GenericService } from "src/common/services/generic.service";
import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { Choice } from "../entities/choices/choice.entity";
import { ChoiceAttribute } from "../entities/choices/choice-attribute.entity";
import { AddChoiceToMenuItemDto } from "../dtos/menu-item-choices/add-choice-to-menu-item.dto";
import { ChoiceAttributeService } from "./choice/choice-attribute.service";
import { ChoiceService } from "./choice/choice.service";
import { MenuItemService } from "./menu-item.service";

@Injectable()
export class MenuItemChoiceService extends GenericService<MenuItemChoices> {

    constructor(
        @InjectDataSource() dataSource: DataSource,
        @InjectRepository(MenuItemChoices)
        readonly menuItemChoiceRepository: Repository<MenuItemChoices>,
        @Inject(ChoiceService)
        readonly choiceService: ChoiceService,
        @Inject(MenuItemService)
        readonly menuItemService: MenuItemService,
    ) {
        super(dataSource, MenuItemChoices, 'choice');
    }

    async addChoiceToMenuItem(addChoiceToMenuItemDto: AddChoiceToMenuItemDto) {
        const menuItem = await this.menuItemService.findOneByIdWithOptions(addChoiceToMenuItemDto.menuItemId);
        const choice = await this.choiceService.findOneByIdWithOptions(addChoiceToMenuItemDto.choiceId);
        const isChoiceAlreadyAdded = menuItem.choices.some(choice => choice.choice.id === choice.id);
        if (isChoiceAlreadyAdded) {
            throw new BadRequestException('Ce choix a déjà été ajouté');
        }
        const menuItemChoice = this.menuItemChoiceRepository.create({ menuItem, choice, additionalPrice: addChoiceToMenuItemDto.additionalPrice });
        return this.menuItemChoiceRepository.save(menuItemChoice);
    }

}
