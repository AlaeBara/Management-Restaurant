import { DataSource, QueryRunner, Repository, UpdateResult } from "typeorm";
import { GenericService } from "src/common/services/generic.service";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { BadRequestException, forwardRef, Inject, Injectable, InternalServerErrorException } from "@nestjs/common";
import { MenuItemRecipe } from "../entities/menu-item-recipe.entity";
import { MenuItem } from "../entities/menu-item.entity";
import { ProductService } from "src/product-management/services/product.service";
import { UnitService } from "src/unit-management/services/unit.service";
import { InventoryService } from "src/inventory-managemet/services/inventory.service";
import { CreateMenuItemIngredientRecipeDto } from "../dtos/menu-item-recipe/create-menu-item-ingredient-recipe.dto";
import { OnEvent } from "@nestjs/event-emitter";
import logger from "src/common/Loggers/logger";
import { MenuItemService } from "./menu-item.service";
import { InventoryMovementService } from "src/inventory-managemet/services/inventory-movement.service";
import { Order } from "src/order-management/entities/order.entity";
import { OrderItem } from "src/order-management/entities/order-item.entity";

@Injectable()
export class MenuItemRecipeService extends GenericService<MenuItemRecipe> {

    constructor(
        @InjectDataSource() dataSource: DataSource,
        @InjectRepository(MenuItemRecipe)
        readonly recipeRepository: Repository<MenuItemRecipe>,
        @Inject(forwardRef(() => ProductService))
        private readonly productService: ProductService,
        @Inject(forwardRef(() => UnitService))
        private readonly unitService: UnitService,
        @Inject(forwardRef(() => InventoryService))
        private readonly inventoryService: InventoryService,
        @Inject(forwardRef(() => MenuItemService))
        private readonly menuItemService: MenuItemService,
        @Inject(forwardRef(() => InventoryMovementService))
        private readonly inventoryMovementService: InventoryMovementService


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

    async createBatchRecipes(menuItem: MenuItem, dto: CreateMenuItemIngredientRecipeDto[], queryRunner: QueryRunner): Promise<MenuItemRecipe[]> {

        if (!menuItem) throw new BadRequestException('Le produit de menu indéfini');
        if (menuItem.portionProduced <= 0) throw new BadRequestException('Le nombre de portion produite par recette ne peut être inférieur ou égale à 0');

        const recipes = await Promise.all(dto.map(async (recipeItem) => {
            if (recipeItem.ingredientQuantity <= 0) throw new BadRequestException('La quantité de l\'ingrédient ne peut être inférieure ou égale à 0');
            const [product, unit, inventory] = await Promise.all([
                this.productService.findOneByIdWithOptions(recipeItem.productId),
                this.unitService.findOneByIdWithOptions(recipeItem.unitId),
                this.inventoryService.findOneByIdWithOptions(recipeItem.inventoryId)
            ]);


            return this.recipeRepository.create({
                menuItem: menuItem,
                ingredientQuantity: recipeItem.ingredientQuantity,
                product: product,
                inventory: inventory,
                unit: unit,
                quantityRequiredPerPortion: recipeItem.ingredientQuantity / menuItem.portionProduced,
            });
        }));

        return await queryRunner.manager.save(MenuItemRecipe, recipes);
    }

    async restoreRecipes(menuItem: MenuItem, queryRunner: QueryRunner) {
        await queryRunner.manager.restore(MenuItemRecipe, { menuItem: { id: menuItem.id } });
    }

    async softDeleteRecipes(menuItem: MenuItem, queryRunner: QueryRunner) {
        await queryRunner.manager.softDelete(MenuItemRecipe, { menuItem: { id: menuItem.id } });
    }

    async recalculateQuantityBasedOnStock(menuItem: MenuItem): Promise<UpdateResult> {
        try {
            if (!menuItem.hasRecipe) return; // Early return if menu item has no recipe

            const recipes = await this.recipeRepository.find({ where: { menuItem: { id: menuItem.id } }, relations: ['inventory', 'unit', 'product'] });


            if (!recipes || recipes.length === 0) {
                logger.warn('No recipes found for menu item: ' + menuItem.id);
                return;
            }

            const minQuantity = recipes.map(recipe => {
                let inventoryQuantity = recipe.inventory.currentQuantity;

                if (recipe.inventory.unit.id !== recipe.unit.id) {
                    inventoryQuantity = Number(inventoryQuantity) * Number(recipe.inventory.unit.conversionFactorToBaseUnit);
                }

                const calculatedQuantity = Math.floor(Number(inventoryQuantity) / Number(recipe.quantityRequiredPerPortion));
                return calculatedQuantity;
            });


            const quantity = Math.min(...minQuantity);

            if (!isFinite(quantity)) {
                logger.warn('Invalid quantity calculated:', { menuItem, quantity });
                return;
            }

            return await this.menuItemService.setQuantityBasedOnStock(menuItem, quantity);
        } catch (error) {
            logger.error('Error in recalculate Quantity Based On Stock:', { message: error.message, stack: error.stack });
            throw new InternalServerErrorException(error.message);
        }
    }

    /* async executeMovements(orderItems: OrderItem[], menuItem: MenuItem, order: Order, queryRunner: QueryRunner) {
        for (const menuItem of orderItems) {
            for (const ingredient of menuItem.rec) {
                if (await this.isSameUnit(recipe.inventory.id, recipe.unit.id)) {
                    await this.inventoryMovementService.executeOrderMovementOperation(orderItem.quantity * recipe.quantityRequiredPerPortion, recipe.inventory.id, order.orderNumber, queryRunner);
                }
                else {
                    console.log('not same unit 2');
                }
            }

        }
    } */



    async updateQuantity(menuItem: MenuItem, quantity: number, queryRunner: QueryRunner) {
        menuItem.quantity -= Number(quantity);
        await queryRunner.manager.save(menuItem);
    }

    async isSameUnit(recipeId: string): Promise<boolean> {
        const menuItemRecipe = await this.recipeRepository.findOne({ where: { id: recipeId } });
        return menuItemRecipe.inventory.unit === menuItemRecipe.unit;
    }


}
