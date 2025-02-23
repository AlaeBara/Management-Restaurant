import {
    DataSource,
    IsNull,
    Not,
    QueryRunner,
    Repository,
    UpdateResult
} from "typeorm";
import {
    BadRequestException,
    forwardRef,
    Inject,
    Injectable,
    InternalServerErrorException
} from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";

import { GenericService } from "src/common/services/generic.service";
import { MenuItem } from "../entities/menu-item.entity";
import { CreateMenuItemDto } from "../dtos/menu-item/create-menu-item.dto";
import { CategoryService } from "src/category-management/services/category.service";
import { MenuItemTagService } from "./menu-item-tag.service";
import { MenuItemTranslationService } from "./menu-item-translation.service";
import { LanguageService } from "src/language-management/services/langague.service";
import { MenuItemDiscountService } from "./menu-item-discount.service";
import { ProductService } from "src/product-management/services/product.service";
import { UnitService } from "src/unit-management/services/unit.service";
import { MenuItemRecipeService } from "./menu-item-recipe.service";
import { MediaLibraryService } from "src/media-library-management/services/media-library.service";
import { InventoryService } from "src/inventory-managemet/services/inventory.service";
import logger from "src/common/Loggers/logger";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { MenuItemChoiceService } from "./menu-item-choice.service";
import internal from "stream";
import { MenuItemResponseDto } from "../dtos/public/menu-item-response.public.dto";
import { plainToInstance } from "class-transformer";

@Injectable()
export class MenuItemService extends GenericService<MenuItem> {

    constructor(
        @InjectDataSource() public dataSource: DataSource,
        @InjectRepository(MenuItem)
        readonly menuItemRepository: Repository<MenuItem>,
        @Inject(forwardRef(() => CategoryService))
        readonly categoryService: CategoryService,
        @Inject(forwardRef(() => MenuItemTagService))
        readonly TagService: MenuItemTagService,
        @Inject(forwardRef(() => MenuItemTranslationService))
        readonly translateService: MenuItemTranslationService,
        @Inject(forwardRef(() => LanguageService))
        readonly languageService: LanguageService,
        @Inject(forwardRef(() => MenuItemDiscountService))
        readonly discountService: MenuItemDiscountService,
        @Inject(forwardRef(() => ProductService))
        readonly productService: ProductService,
        @Inject(forwardRef(() => UnitService))
        readonly unitService: UnitService,
        @Inject(forwardRef(() => MenuItemRecipeService))
        readonly recipeService: MenuItemRecipeService,
        @Inject(forwardRef(() => MediaLibraryService))
        readonly mediaLibraryService: MediaLibraryService,
        @Inject(forwardRef(() => InventoryService))
        readonly inventoryService: InventoryService,
        @Inject(forwardRef(() => MenuItemChoiceService))
        readonly menuItemChoiceService: MenuItemChoiceService,
        private eventEmitter: EventEmitter2
    ) {
        super(dataSource, MenuItem, 'article menu');
    }

    async inizializeQueryRunner() {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        return queryRunner;
    }

    async createMenuItem(createMenuItemDto: CreateMenuItemDto, req: Request) {
        const queryRunner = await this.inizializeQueryRunner();

        try {
            await this.validateUnique({ menuItemSku: createMenuItemDto.menuItemSku });

            const menuItem = await this.createBaseMenuItem(createMenuItemDto, queryRunner, req);

            await this.createRelatedEntities(menuItem, createMenuItemDto, queryRunner, req);
            await this.discountService.setDiscountToMenuItem(menuItem, createMenuItemDto, queryRunner);

            await queryRunner.commitTransaction();

            if (menuItem.hasRecipe) {
                this.eventEmitter.emit('menu.item.created', menuItem);
            }
        } catch (error) {
            await queryRunner.rollbackTransaction();
            logger.error('Error creating menu item:', { message: error.message, stack: error.stack });
            throw new InternalServerErrorException(error.message);
        } finally {
            await queryRunner.release();
        }

    }

    private async createBaseMenuItem(dto: CreateMenuItemDto, queryRunner: QueryRunner, req: Request) {
        const category = await this.categoryService.findOneByIdWithOptions(dto.categoryId);


        const menuItem = this.menuItemRepository.create({
            ...dto,
            category: category,
            tags: [],
            translates: [],
            recipe: [],
            images: [],
            choices: []
        });

        if (dto.portionProduced && dto.hasRecipe) {
            menuItem.portionProduced = dto.portionProduced;
        } else {
            delete menuItem.portionProduced;
        }

        return await queryRunner.manager.save(MenuItem, menuItem);
    }

    private async createRelatedEntities(menuItem: MenuItem, dto: CreateMenuItemDto, queryRunner: QueryRunner, req: Request) {
        if (dto.hasRecipe) {
            if (dto.recipe && dto.recipe.length === 0) {
                throw new BadRequestException('Vous devez ajouter au moins un ingrédient');
            }

            menuItem.recipe = await this.recipeService.createBatchRecipes(menuItem, dto.recipe, queryRunner);
        }

        if (dto.choices && dto.choices.length > 0) {
            menuItem.choices = await this.menuItemChoiceService.addChoicesToMenuItemBatch(dto.choices, menuItem, queryRunner);
        }

        if (dto.translates && dto.translates.length > 0) {
            menuItem.translates = await this.translateService.createBatchTranslations(menuItem, dto.translates, queryRunner);
        }

        if (dto.tagIds && dto.tagIds.length > 0) {
            menuItem.tags = await this.TagService.addTagsToMenuItemBatch(menuItem, dto.tagIds, queryRunner);
        }

        if (dto.images && dto.images.length > 0) {
            await Promise.all(dto.images.map(async (image) => {
                const mediaLibrary = await this.mediaLibraryService.iniMediaLibrary(image, 'menu-items', req['user'].sub, queryRunner);
                menuItem.images.push(mediaLibrary);
            }));
        }
    }

    async findOneByIdOrFail(id: string) {
        const menuItem = await this.menuItemRepository.findOne({
            where: {
                id,
                deletedAt: IsNull()
            }
        });
        if (!menuItem) throw new BadRequestException('Le produit de menu n\'existe pas.');
        return menuItem;
    }

    async deleteMenuItem(id: string) {
        const queryRunner = await this.inizializeQueryRunner();
        try {
            const menuItem = await this.findOneByIdOrFail(id);
            await this.translateService.softDeleteTranslations(menuItem, queryRunner);
            await this.recipeService.softDeleteRecipes(menuItem, queryRunner);
            await queryRunner.manager.softDelete(MenuItem, { id: menuItem.id });
            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw new BadRequestException(error.message);
        } finally {
            await queryRunner.release();
        }
    }

    async findDeletedOneByIdOrFail(id: string) {
        const menuItem = await this.menuItemRepository.findOne({
            where: {
                id,
                deletedAt: Not(IsNull())
            },
            withDeleted: true
        });

        if (!menuItem) throw new BadRequestException('Le produit de menu supprimé n\'existe pas');

        const doubleSku = await this.menuItemRepository.findOne({
            where: {
                menuItemSku: menuItem.menuItemSku
            },
            withDeleted: false
        });

        if (doubleSku) throw new BadRequestException('Un produit de menu avec le même SKU existe déjà');

        return menuItem;
    }

    async restoreMenuItem(id: string) {
        const queryRunner = await this.inizializeQueryRunner();
        try {
            const menuItem = await this.findDeletedOneByIdOrFail(id);
            await this.translateService.restoreTranslations(menuItem, queryRunner);
            await this.recipeService.restoreRecipes(menuItem, queryRunner);
            await queryRunner.manager.restore(MenuItem, { id: id });
            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw new BadRequestException(error.message);
        } finally {
            await queryRunner.release();
        }
    }

    async setQuantityBasedOnStock(menuItem: MenuItem, quantity: number): Promise<UpdateResult> {
        return await this.menuItemRepository.update(
            { id: menuItem.id },
            { quantity: quantity }
        );
    }

    async updateQuantity(menuItemId: string, quantity: number, queryRunner: QueryRunner): Promise<UpdateResult> {
        return await queryRunner.manager.update(
            MenuItem,
            { id: menuItemId },
            { quantity: quantity }
        );
    }

    async isCategoryUsed(id: string) {
        const menuItems = await this.menuItemRepository.find({ where: { category: { id } } });
        return menuItems.length > 0;
    }

    async toggleMenuItemHiddenState(id: string) {
        const menuItem = await this.findOneByIdWithOptions(id);
        menuItem.hidden = !menuItem.hidden;
        await this.menuItemRepository.save(menuItem);
        if (menuItem.hidden) {
            return 'Super! Votre produit de menu a été masqué avec succès';
        } else {
            return 'Super! Votre produit de menu a été affiché avec succès';
        }
    }

    async getMenuItemIdsByInventoryId(inventoryId: string): Promise<string[]> {
        try {
            const menuItems = await this.menuItemRepository.find({
                select: ['id'],
                where: {
                    hasRecipe: true,
                    hidden: false,
                    recipe: {
                        inventory: {
                            id: inventoryId
                        }
                    }
                },
                withDeleted: false
            });

            return menuItems.map(item => item.id);
        } catch (error) {
            logger.error('Error fetching menu item IDs by inventory ID:', {
                message: error.message,
                stack: error.stack,
                inventoryId
            });
            throw new InternalServerErrorException('Failed to fetch menu item IDs');
        }
    }

    async getMenuItemsByTag(tag: string) {
        const menuItems = await this.menuItemRepository.createQueryBuilder('menuItem')
        .leftJoinAndSelect('menuItem.tags', 'tag') // Join the tags relation
        .leftJoinAndSelect('menuItem.translates', 'translates') // Join the choices relation
        .leftJoinAndSelect('translates.language', 'language') // Join the choices relation
        .leftJoinAndSelect('menuItem.discount', 'discount') // Join the choices relationç
        .leftJoinAndSelect('menuItem.images', 'images') // Join the choices relation
        .leftJoinAndSelect('menuItem.recipe', 'recipe') // Join the choices relation
        .leftJoinAndSelect('menuItem.category', 'category') // Join the choices relation
        .where('tag.id = :tagId', { tagId: tag }) // Filter by tag ID
        .getMany();

        return plainToInstance(MenuItemResponseDto, menuItems, {
            excludeExtraneousValues: true
        });
    }
}
