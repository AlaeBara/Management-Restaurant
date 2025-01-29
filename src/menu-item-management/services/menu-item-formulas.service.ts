import { DataSource, QueryRunner, Repository } from "typeorm";
import { GenericService } from "src/common/services/generic.service";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { MenuItemFormula } from "../entities/menu-item-formula.entity";
import { MenuItem } from "../entities/menu-item.entity";
import { ProductService } from "src/product-management/services/product.service";
import { UnitService } from "src/unit-management/services/unit.service";
import { CreateMenuItemFormulaDto } from "../dtos/menu-item-formula/create-menu-item-formula.dto";
import { InventoryService } from "src/inventory-managemet/services/inventory.service";

@Injectable()
export class MenuItemFormulaService extends GenericService<MenuItemFormula> {

    constructor(
        @InjectDataSource() dataSource: DataSource,
        @InjectRepository(MenuItemFormula)
        readonly formulaRepository: Repository<MenuItemFormula>,
        private readonly productService: ProductService,
        private readonly unitService: UnitService,
        private readonly inventoryService: InventoryService

    ) {
        super(dataSource, MenuItemFormula, 'formule de l\'article menu');
    }

    async createFormulas(menuItem: MenuItem, dto: CreateMenuItemFormulaDto, queryRunner: QueryRunner) {
        if (dto.quantityFormula <= 0) throw new BadRequestException('La quantité de la recette ne peut être inférieure ou égale à 0');

        const inventory = await this.inventoryService.findOneByIdWithOptions(dto.inventoryId);

        const [product, unit] = await Promise.all([
            this.productService.findOneByIdWithOptions(dto.productId),
            this.unitService.findOneByIdWithOptions(dto.unitId)
        ]);

        const formula = this.formulaRepository.create({
            menuItem: menuItem,
            product: product,
            quantityFormula: dto.quantityFormula,
            inventory: inventory,
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

    async recalculateQuantityBasedOnStock(id: string) {
        try {
            let minQuantity = [];

            const formulas = await this.formulaRepository.find({ where: { menuItem: { id: id } }, relations: ['inventory', 'unit', 'product'] });

            console.log('formulas', formulas);

            formulas.forEach(async formula => {
                let quantity = 0;

                if (formula.inventory.productUnit != formula.unit.unit) {
                    quantity = Number(formula.inventory.totalQuantity) / Number(formula.unit.conversionFactorToBaseUnit)
                }

                const calculePortion = Math.floor(Number(quantity) / Number(formula.quantityRequiredPerPortion))

                minQuantity.push(calculePortion)
            });

            return Math.min(...minQuantity);
        } catch (error) {
            console.error('Error in recalculateQuantityBasedOnStock:', error);
            throw new InternalServerErrorException('Une erreur est survenue lors du recalcul de la quantité');
        }
    }

}
