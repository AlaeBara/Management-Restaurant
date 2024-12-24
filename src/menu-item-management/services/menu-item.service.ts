import { DataSource, Repository } from "typeorm";
import { MenuItemTag } from "../entities/menu-item-tag.entity";
import { GenericService } from "src/common/services/generic.service";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { BadRequestException, forwardRef, Inject, Injectable } from "@nestjs/common";
import { MenuItem } from "../entities/menu-item.entity";
import { CreateMenuItemTagDto } from "../dtos/menu-item-tag/create-menu-item-tag.dto";
import { CreateMenuItemDto } from "../dtos/menu-item/create-menu-item.dto";
import { Category } from "src/category-item-management/entities/category.entity";
import { CategoryService } from "src/category-item-management/services/category.service";
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
        readonly menuItemPriceService: MenuItemPriceService,
        @Inject(forwardRef(() => MenuItemDiscountService))
        readonly discountService: MenuItemDiscountService,
        @Inject(forwardRef(() => MenuItemPriceHistoryService))
        readonly menuItemPriceHistoryService: MenuItemPriceHistoryService,
        @Inject(forwardRef(() => ProductService))
        readonly productService: ProductService,
        @Inject(forwardRef(() => UnitService))
        readonly unitService: UnitService,
        @Inject(forwardRef(() => MenuItemFormulaService))
        readonly menuItemFormulaService: MenuItemFormulaService,


    ) {
        super(dataSource, MenuItem, 'article menu');
    }



    async createMenuItem(createMenuItemDto: CreateMenuItemDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        
        try {




            const category = await this.categoryService.findOneByIdWithOptions(createMenuItemDto.categoryId);
            const menuItem = this.menuItemRepository.create({
                ...createMenuItemDto,
                category: category,
                tags: [],
                translates: []
            });



            // Fetch and add tags
            await Promise.all(createMenuItemDto.tagIds.map(async (tagId) => {
                const tag = await this.TagService.findOneByIdWithOptions(tagId);
                menuItem.tags.push(tag);
            }));


    
            // Save menu item using queryRunner
            const menuItemSaved = await queryRunner.manager.save(MenuItem, menuItem);
    




            // Create translations
            const translations = await Promise.all(
                createMenuItemDto.translates.map(async (translate) => {
                    const language = await this.languageService.getLanguageByCode(translate.languageId);
                    return this.translateService.menuItemTranslationRepository.create({
                        menuItem: menuItemSaved,
                        language: language,
                        name: translate.name,
                        description: translate.description,
                    });
                })
            );

            // Save translations using queryRunner
            await queryRunner.manager.save(MenuItemTranslate,translations);





            const discount = createMenuItemDto.price.discountId ? await this.discountService.findOneByIdWithOptions(createMenuItemDto.price.discountId) : null;
            const price = createMenuItemDto.price.basePrice;
            // Create and save price using queryRunner
            const menuItemPrice = this.menuItemPriceService.menuItemPriceRepository.create({
                menuItem: menuItemSaved,
                basePrice: price,
                discount: discount,
                finalPrice: await this.discountService.setDiscount(price, discount),
            });
            await queryRunner.manager.save(menuItemPrice);


            const menuItemPriceHistory = this.menuItemPriceHistoryService.menuItemPriceHistoryRepository.create({
                price: menuItemPrice,
                oldPrice: null,
                newPrice: menuItemPrice.finalPrice,
            });
            await queryRunner.manager.save(menuItemPriceHistory);
    



            if(createMenuItemDto.hasFormulas){
                const formulas = await Promise.all(createMenuItemDto.formulas.map(async (formula) => {
                    const product = await this.productService.findOneByIdWithOptions(formula.productId);
                    const unit = await this.unitService.findOneByIdWithOptions(formula.unitId);
                    return this.menuItemFormulaService.menuItemFormulaRepository.create({
                        menuItem: menuItemSaved,
                        product: product,
                        warningQuantity: formula.warningQuantity,
                        quantityFormula: formula.quantityFormula,
                        portionProduced: formula.portionProduced,
                        unit: unit,
                        quantityRequiredPerPortion: formula.quantityFormula / formula.portionProduced,
                    });
                }));
                await queryRunner.manager.save(formulas);
            }


           





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

}