import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, In, QueryRunner, Repository } from "typeorm";
import { MenuItemChoices } from "../entities/choices/menu-item-choices.entity";
import { GenericService } from "src/common/services/generic.service";
import { BadRequestException, forwardRef, Inject, Injectable } from "@nestjs/common";
import { AddChoiceToMenuItemDto } from "../dtos/menu-item-choices/add-choice-to-menu-item.dto";
import { ChoiceService } from "./choice/choice.service";
import { MenuItemService } from "./menu-item.service";
import { AssignChoicesWithMenuItemDto } from "../dtos/menu-item-choices/assign-choices-with-menu-item.dto";
import { MenuItem } from "../entities/menu-item.entity";
import { Choice } from "../entities/choices/choice.entity";

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

    async inizializeQueryRunner() {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        return queryRunner;
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

    async addChoicesToMenuItemBatch(choices: AssignChoicesWithMenuItemDto[], menuItem: MenuItem, queryRunner: QueryRunner) {
        // Fetch all choice objects in a single query to optimize performance
        const choiceIds = choices.map(choice => choice.choiceId);
        const choiceObjects = await queryRunner.manager.find(Choice, { where: { id: In(choiceIds) } });
    
        // Map the choices to MenuItemChoices entities
        const menuItemChoices = choices.map(choice => {
            const choiceObject = choiceObjects.find(c => c.id === choice.choiceId);
            if (!choiceObject) {
                throw new BadRequestException(`Choice with ID ${choice.choiceId} not found`);
            }
            return queryRunner.manager.create(MenuItemChoices, {
                menuItem,
                choice: choiceObject,
                additionalPrice: choice.additionalPrice
            });
        });
    
        // Perform a batch insert
        return await queryRunner.manager.save(MenuItemChoices, menuItemChoices);
    }

    async countMenuItemByChoiceId(choiceId: string) {
        return this.menuItemChoiceRepository.count({ where: { choice: { id: choiceId } } });
    }

}
