import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { MenuItemChoices } from "../entities/choices/menu-item-choices.entity";
import { GenericService } from "src/common/services/generic.service";
import { BadRequestException, forwardRef, Inject, Injectable } from "@nestjs/common";
import { AddChoiceToMenuItemDto } from "../dtos/menu-item-choices/add-choice-to-menu-item.dto";
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
        @Inject(forwardRef(() => MenuItemService))
        readonly menuItemService: MenuItemService,

    ) {
        super(dataSource, MenuItemChoices, 'choice');
    }

    async addChoiceToMenuItem(addChoiceToMenuItemDto: AddChoiceToMenuItemDto) {
        const menuItem = await this.menuItemService.findOneByIdWithOptions(addChoiceToMenuItemDto.menuItemId);
        const choice = await this.choiceService.findOneByIdWithOptions(addChoiceToMenuItemDto.choiceId);
        if (await this.countMenuItemByChoiceId(choice.id) > 0) {
            throw new BadRequestException('Ce choix a déjà été ajouté');
        }
        const menuItemChoice = this.menuItemChoiceRepository.create({
            menuItem,
            choice,
            additionalPrice: addChoiceToMenuItemDto.additionalPrice
        });
        return this.menuItemChoiceRepository.save(menuItemChoice);

    }

    async countMenuItemByChoiceId(choiceId: string) {
        return this.menuItemChoiceRepository.count({ where: { choice: { id: choiceId } } });
    }

}
