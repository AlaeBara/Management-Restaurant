import { DataSource, QueryRunner, Repository } from "typeorm";
import { MenuItemTag } from "../entities/menu-item-tag.entity";
import { GenericService } from "src/common/services/generic.service";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { BadRequestException, Injectable } from "@nestjs/common";
import { MenuItemTranslate } from "../entities/menu-item-translation.enity";
import { MenuItemPrice } from "../entities/menu-item-price.entityt";
import { MenuItemFormula } from "../entities/menu-item-formula.entity";
import { MenuItem } from "../entities/menu-item.entity";
import { ProductService } from "src/product-management/services/product.service";
import { UnitService } from "src/unit-management/services/unit.service";
import { CreateMenuItemFormulaDto } from "../dtos/menu-item-formula/create-menu-item-formula.dto";

@Injectable()
export class MenuItemFormulaService extends GenericService<MenuItemFormula> {
    constructor(
        @InjectDataSource() dataSource: DataSource,
        @InjectRepository(MenuItemFormula)
        readonly formulaRepository: Repository<MenuItemFormula>,
        private readonly productService: ProductService,
        private readonly unitService: UnitService

    ) {
        super(dataSource, MenuItemFormula, 'formule de l\'article menu');
    }

    async createFormulas(menuItem: MenuItem, dto: CreateMenuItemFormulaDto, queryRunner: QueryRunner) {
       // if (!dto.hasFormulas) return;
    
        if (dto.quantityFormula <= 0) throw new BadRequestException('La quantité de la recette ne peut être inférieure ou égale à 0');
        if (dto.warningQuantity < 0) throw new BadRequestException('La quantité de sécurité ne peut être inférieure à 0');
        
        const [product, unit] = await Promise.all([
            this.productService.findOneByIdWithOptions(dto.productId),
            this.unitService.findOneByIdWithOptions(dto.unitId)
        ]);
    
        const formula = this.formulaRepository.create({
            menuItem: menuItem,
            product: product,
            warningQuantity: dto.warningQuantity,
            quantityFormula: dto.quantityFormula,
            unit: unit,
            quantityRequiredPerPortion: dto.quantityFormula / menuItem.portionProduced,
        });
    
        await queryRunner.manager.save(MenuItemFormula, formula);
    }

    async restoreFormulas(menuItem: MenuItem, queryRunner: QueryRunner) {
        await queryRunner.manager.restore(MenuItemFormula, { menuItem: { id: menuItem.id } });
    }

    async softDeleteFormulas(menuItem: MenuItem, queryRunner: QueryRunner) {
        await queryRunner.manager.softDelete(MenuItemFormula, { menuItem: { id: menuItem.id } });
    }
}