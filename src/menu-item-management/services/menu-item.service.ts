import { DataSource, IsNull, Not, QueryRunner, Repository } from "typeorm";
import { MenuItemTag } from "../entities/menu-item-tag.entity";
import { GenericService } from "src/common/services/generic.service";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { BadRequestException, forwardRef, Inject, Injectable } from "@nestjs/common";
import { MenuItem } from "../entities/menu-item.entity";
import { CreateMenuItemTagDto } from "../dtos/menu-item-tag/create-menu-item-tag.dto";
import { CreateMenuItemDto } from "../dtos/menu-item/create-menu-item.dto";
import { Category } from "src/category-management/entities/category.entity";
import { CategoryService } from "src/category-management/services/category.service";
import { MenuItemTagService } from "./menu-item-tag.service";
import { MenuItemTranslationService } from "./menu-item-translation.service";
import { LanguageService } from "src/language-management/services/langague.service";
import { MenuItemTranslate } from "../entities/menu-item-translation.enity";
import { MenuItemPriceService } from "./menu-item-price.service";
import { MenuItemDiscountService } from "./menu-item-discount.service";
import { MenuItemPriceHistoryService } from "./menu-item-price-history.service";
import { MenuItemPriceHistory } from "../entities/menu-item-price-history.entity";
import { MenuItemPrice } from "../entities/menu-item-price.entityt";
import { ProductService } from "src/product-management/services/product.service";
import { UnitService } from "src/unit-management/services/unit.service";
import { MenuItemFormulaService } from "./menu-item-formulas.service";
import { MenuItemFormula } from "../entities/menu-item-formula.entity";

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
        @Inject(forwardRef(() => MenuItemPriceService))
        readonly PriceService: MenuItemPriceService,
        @Inject(forwardRef(() => MenuItemDiscountService))
        readonly discountService: MenuItemDiscountService,
        @Inject(forwardRef(() => MenuItemPriceHistoryService))
        readonly priceHistoryService: MenuItemPriceHistoryService,
        @Inject(forwardRef(() => ProductService))
        readonly productService: ProductService,
        @Inject(forwardRef(() => UnitService))
        readonly unitService: UnitService,
        @Inject(forwardRef(() => MenuItemFormulaService))
        readonly formulaService: MenuItemFormulaService,


    ) {
        super(dataSource, MenuItem, 'article menu');
    }

    async inizializeQueryRunner() {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        return queryRunner;
    }

    async createMenuItem(createMenuItemDto: CreateMenuItemDto) {
        const queryRunner = await this.inizializeQueryRunner();

        try {

            await this.validateUnique({ menuItemSku: createMenuItemDto.menuItemSku });


            const category = await this.categoryService.findOneByIdWithOptions(createMenuItemDto.categoryId);
            if(createMenuItemDto.hasFormulas){
                if(createMenuItemDto.portionProduced <= 0) throw new BadRequestException('La quantité produite ne peut être inférieure ou égale à 0');
            }
           
            const menuItem = this.menuItemRepository.create({
                ...createMenuItemDto,
                category: category,
                tags: [],
                translates: [],
                formulas: [],
                price: null,
            });

            // Fetch and add tags
            await Promise.all(createMenuItemDto.tagIds.map(async (tagId) => {
                const tag = await this.TagService.findOneByIdWithOptions(tagId);
                menuItem.tags.push(tag);
            }));

            // Save menu item using queryRunner
            const menuItemSaved = await queryRunner.manager.save(MenuItem, menuItem);
            let formulas: MenuItemFormula[] = [];
            if (createMenuItemDto.hasFormulas) {

                if (createMenuItemDto.formulas.length === 0) throw new BadRequestException('Vous devez ajouter au moins une formule');

                formulas = await Promise.all(createMenuItemDto.formulas.map(async (formula) => {
                    if (formula.quantityFormula <= 0) throw new BadRequestException('La quantité de la recette ne peut être inférieure ou égale à 0');
                    //if (formula.portionProduced <= 0) throw new BadRequestException('La quantité produite ne peut être inférieure ou égale à 0');
                    if (formula.warningQuantity < 0) throw new BadRequestException('La quantité de sécurité ne peut être inférieure à 0');
                    const product = await this.productService.findOneByIdWithOptions(formula.productId);
                    const unit = await this.unitService.findOneByIdWithOptions(formula.unitId);
                    return this.formulaService.formulaRepository.create({
                        menuItem: menuItemSaved,
                        product: product,
                        warningQuantity: formula.warningQuantity,
                        quantityFormula: formula.quantityFormula,
                      //  portionProduced: formula.portionProduced,
                        unit: unit,
                        quantityRequiredPerPortion: formula.quantityFormula / menuItemSaved.portionProduced,
                    });
                }));
            }

            await queryRunner.manager.save(MenuItemFormula, formulas);



            const translations = await Promise.all(createMenuItemDto.translates.map(async (translate) => {
                const language = await this.languageService.getLanguageByCode(translate.languageId);
                return this.translateService.translationRepository.create({
                    menuItem: menuItemSaved,
                    language: language,
                    name: translate.name,
                    description: translate.description,
                });

            }));

            await queryRunner.manager.save(MenuItemTranslate, translations);





            const discount = createMenuItemDto.price.discountId ? await this.discountService.findOneByIdWithOptions(createMenuItemDto.price.discountId) : null;
            const price = createMenuItemDto.price.basePrice;
            // Create and save price using queryRunner
            const menuItemPrice = this.PriceService.priceRepository.create({
                menuItem: menuItemSaved,
                basePrice: price,
                discount: discount,
            });
            await queryRunner.manager.save(menuItemPrice);


            const menuItemPriceHistory = this.priceHistoryService.priceHistoryRepository.create({
                price: menuItemPrice,
                oldPrice: null,
                newPrice: menuItemPrice.basePrice,
            });
            await queryRunner.manager.save(menuItemPriceHistory);

            // Commit the transaction
            await queryRunner.commitTransaction();

            return menuItemSaved;
        } catch (error) {
            // Rollback the transaction on error
            await queryRunner.rollbackTransaction();
            throw new BadRequestException(error.message);
        } finally {
            // Release the query runner
            await queryRunner.release();
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

    async validateMenuItemDeletion(menuItem: MenuItem) {
        if (menuItem.hasFormulas && menuItem.quantity > 0) {
            throw new BadRequestException('Le produit de menu ne peut être supprimé car il a une quantité supérieure à 0 . Vous devez d\'abord libérer les quantités en stock.');
        }
    }

    async deleteMenuItem(id: string) {
        const queryRunner = await this.inizializeQueryRunner();
        try {
            const menuItem = await this.findOneByIdOrFail(id);
            await this.validateMenuItemDeletion(menuItem);
            await this.translateService.softDeleteTranslations(menuItem, queryRunner);
            await this.formulaService.softDeleteFormulas(menuItem, queryRunner);
            await this.PriceService.softDeletePrice(menuItem, queryRunner);
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
        console.log(id);
        const menuItem = await this.menuItemRepository.findOne({
            where: {
                id,
                deletedAt: Not(IsNull())
            },
            withDeleted: true
        });
        console.log(menuItem);
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
            await this.formulaService.restoreFormulas(menuItem, queryRunner);
            await this.PriceService.restorePrice(menuItem, queryRunner);
            await queryRunner.manager.restore(MenuItem, { id: id });
            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw new BadRequestException(error.message);
        } finally {
            await queryRunner.release();
        }
    }
}