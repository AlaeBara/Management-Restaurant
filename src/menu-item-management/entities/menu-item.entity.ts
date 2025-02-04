import {
    AfterLoad,
    Column,
    Entity,
    Index,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany
} from "typeorm";

import { BaseEntity } from "src/common/entities/base.entity";
import { Category } from "src/category-management/entities/category.entity";
import { MenuItemTag } from "./menu-item-tag.entity";
import { MenuItemRecipe } from "./menu-item-recipe.entity";
import { MenuItemTranslate } from "./menu-item-translation.enity";
import { MediaLibrary } from "src/media-library-management/entities/media-library.entity";
import { DiscountStatus } from "../enums/discount-status.enum";
import { MenuItemDiscount } from "./menu-item-discount.entity";
import { DiscountMethod } from "../enums/discount-method.enum";
import { DiscountLevel } from "../enums/discount-level.enum";
import { MenuItemChoices } from "./choices/menu-item-choices.entity";

interface TransformedChoice {
    id: string | number;
    additionalPrice: number;
    value: string;
}

interface GroupedChoices {
    [attribute: string]: TransformedChoice[];
}

@Entity(`${process.env.DATASET_PREFIX || ''}item_menu`)
@Index(['menuItemSku'])
export class MenuItem extends BaseEntity {

    @Column({ type: 'varchar', length: 15 })
    menuItemSku: string;

    @Column({ type: 'int', default: 0, nullable: true })
    quantity: number;

    @Column({ type: 'int' })
    warningQuantity: number;

    @Column({ type: 'boolean', default: false })
    hidden: boolean;

    @Column({ type: 'boolean' })
    isPublished: boolean;

    @Column({ type: 'boolean' })
    isDraft: boolean;

    @ManyToOne(() => Category, (category) => category.id, { nullable: true, eager: true })
    category: Category

    @ManyToMany(() => MenuItemTag, { nullable: true, eager: true })
    @JoinTable({ name: `${process.env.DATASET_PREFIX || ''}item_menu_tag_relation` })
    tags: MenuItemTag[];

    @ManyToMany(() => MediaLibrary, { nullable: true, eager: true })
    @JoinTable({ name: `${process.env.DATASET_PREFIX || ''}item_menu_image_relation` })
    images: MediaLibrary[];

    @Column({ type: 'boolean', default: false })
    hasRecipe: boolean; // if the menu item has formulas to track the quantity of the product and handel inventory automatically

    @OneToMany(
        () => MenuItemRecipe,
        (recipe) => recipe.menuItem,
        { cascade: true }
    )
    recipe: MenuItemRecipe[]; // the recipe of the menu item has ingredients

    @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true, default: null })
    portionProduced: number;

    @OneToMany(
        () => MenuItemTranslate,
        (menuItemTranslate) => menuItemTranslate.menuItem,
        { eager: true, cascade: true, orphanedRowAction: 'delete' } // Properly configured
    )
    translates: MenuItemTranslate[];

    @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
    basePrice: number;

    @Column({ type: 'varchar', enum: DiscountLevel, default: DiscountLevel.NO_DISCOUNT, nullable: true })
    discountLevel: DiscountLevel | null;

    @ManyToOne(() => MenuItemDiscount, (discount) => discount.id, { nullable: true, eager: true })
    discount: MenuItemDiscount;

    @Column({ type: 'varchar', enum: DiscountMethod, default: null, nullable: true })
    discountMethod: DiscountMethod | null;

    @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true, default: null })
    discountValue: number | null;

    finalPrice: number;

    @OneToMany(() => MenuItemChoices, (menuItemChoices) => menuItemChoices.menuItem, { eager: true, cascade: true, orphanedRowAction: 'delete' })
    choices: MenuItemChoices[];

    groupedChoices: any;
    _originalChoices: MenuItemChoices[];
   
    @AfterLoad()
    async transformChoices() {
        if (this.choices) {
            const transformedChoices = this.choices.map(choice => ({
                id: choice.id,
                additionalPrice: choice.additionalPrice,
                value: choice.choice.value,
                attribute: choice.choice.attribute.attribute
            }));

            // Group by attribute with proper typing
            this.groupedChoices = transformedChoices.reduce<GroupedChoices>((groups, choice) => {
                const attributeName = choice.attribute;
                if (!groups[attributeName]) {
                    groups[attributeName] = [];
                }
                const { attribute, ...choiceWithoutAttribute } = choice;
                groups[attributeName].push(choiceWithoutAttribute);
                return groups;
            }, {});

            // Store original choices in a separate property instead of deleting
            this._originalChoices = this.choices;
            this.choices = undefined;
        }
    }

    @AfterLoad()
    async calculateFinalPrice() {
        if (this.discount && this.discountLevel === DiscountLevel.ADVANCED && this.discount.status === DiscountStatus.IN_DISCOUNT) {
            this.finalPrice = await this.discount.setDiscount(this.basePrice);
            return;
        }

        if (!this.discount && this.discountLevel === DiscountLevel.BASIC) {
            this.finalPrice = await this.setSimpleDiscount();
            return;
        }

        this.finalPrice = this.basePrice;
    }

    private async setSimpleDiscount() {
        return this.discountMethod === DiscountMethod.PERCENTAGE
            ? this.basePrice * (1 - this.discountValue / 100)
            : this.basePrice - this.discountValue;
    }

    getOriginalChoices(): MenuItemChoices[] | undefined {
        return this._originalChoices;
    }
}
