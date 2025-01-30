import { DataSource, QueryRunner, Repository } from "typeorm";
import { GenericService } from "src/common/services/generic.service";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import {  MenuItemRecipe } from "../entities/menu-item-recipe.entity";
import { MenuItem } from "../entities/menu-item.entity";
import { ProductService } from "src/product-management/services/product.service";
import { UnitService } from "src/unit-management/services/unit.service";
import { InventoryService } from "src/inventory-managemet/services/inventory.service";
import { CreateMenuItemIngredientRecipeDto } from "../dtos/menu-item-recipe/create-menu-item-ingredient-recipe.dto";

@Injectable()
export class MenuItemRecipeService extends GenericService<MenuItemRecipe> {

    constructor(
        @InjectDataSource() dataSource: DataSource,
        @InjectRepository(MenuItemRecipe)
        readonly recipeRepository: Repository<MenuItemRecipe>,
        private readonly productService: ProductService,
        private readonly unitService: UnitService,
        private readonly inventoryService: InventoryService

    ) {
        super(dataSource, MenuItemRecipe, 'recette de l\'article menu');
    }

    async createRecipe(menuItem: MenuItem, dto: CreateMenuItemIngredientRecipeDto, queryRunner: QueryRunner) {
       
        if (!menuItem) throw new BadRequestException('Le produit de menu indéfini'); 
        if (dto.ingredientQuantity <= 0) throw new BadRequestException('La quantité de l\'ingrédient ne peut être inférieure ou égale à 0');
        if (menuItem.portionProduced <= 0) throw new BadRequestException('Le nombre de portion produite par recette ne peut être inférieur ou égale à 0');

        const [product, unit, inventory] = await Promise.all([
            this.productService.findOneByIdWithOptions(dto.productId),
            this.unitService.findOneByIdWithOptions(dto.unitId),
            this.inventoryService.findOneByIdWithOptions(dto.inventoryId)
        ]);

        const recipe = this.recipeRepository.create({
            menuItem: menuItem,
            ingredientQuantity: dto.ingredientQuantity,
            product: product,
            inventory: inventory,
            unit: unit,
            quantityRequiredPerPortion: dto.ingredientQuantity / menuItem.portionProduced,
        });

        return await queryRunner.manager.save(MenuItemRecipe, recipe);
    }

    async restoreRecipes(menuItem: MenuItem, queryRunner: QueryRunner) {
        await queryRunner.manager.restore(MenuItemRecipe, { menuItem: { id: menuItem.id } });
    }

    async softDeleteRecipes(menuItem: MenuItem, queryRunner: QueryRunner) {
        await queryRunner.manager.softDelete(MenuItemRecipe, { menuItem: { id: menuItem.id } });
    }

    async recalculateQuantityBasedOnStock(id: string) {
        try {
            let minQuantity = [];

            const recipes = await this.recipeRepository.find({ where: { menuItem: { id: id } }, relations: ['inventory', 'unit', 'product'] });

            recipes.forEach(async recipe => {
                let quantity = 0;

                if (recipe.inventory.productUnit != recipe.unit.unit) {
                    quantity = Number(recipe.inventory.totalQuantity) / Number(recipe.unit.conversionFactorToBaseUnit)
                }

                const calculePortion = Math.floor(Number(quantity) / Number(recipe.quantityRequiredPerPortion))

                minQuantity.push(calculePortion)
            });

            return Math.min(...minQuantity);
        } catch (error) {
            console.error('Error in recalculateQuantityBasedOnStock:', error);
            throw new InternalServerErrorException('Une erreur est survenue lors du recalcul de la quantité');
        }
    }

}
