import { DataSource, Repository } from "typeorm";
import { MenuItemTag } from "../entities/menu-item-tag.entity";
import { GenericService } from "src/common/services/generic.service";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import { MenuItemTranslate } from "../entities/menu-item-translation.enity";
import { MenuItemPrice } from "../entities/menu-item-price.entityt";
import { MenuItemFormula } from "../entities/menu-item-formula.entity";

@Injectable()
export class MenuItemFormulaService extends GenericService<MenuItemFormula> {
    constructor(
        @InjectDataSource() dataSource: DataSource,
        @InjectRepository(MenuItemFormula)
        readonly formulaRepository: Repository<MenuItemFormula>,

    ) {
        super(dataSource, MenuItemFormula, 'formule de l\'article menu');
    }
}