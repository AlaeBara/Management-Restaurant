import { Exclude, Expose, Type } from 'class-transformer';
import { DiscountLevel } from 'src/menu-item-management/enums/discount-level.enum';
import { DiscountMethod } from 'src/menu-item-management/enums/discount-method.enum';

@Exclude()
export class MenuItemTagResponseDto {
    @Expose()
    id: string;

    @Expose()
    tag: string;
}

@Exclude()
export class MenuItemTranslateResponseDto {
    @Expose()
    name: string;

    @Expose()
    description: string;

    @Expose()
    languageValue: string;
}

@Exclude()
export class MenuItemDiscountResponseDto {
    @Expose()
    status: string;

    @Expose()
    discountMethod: string;

    @Expose()
    discountValue: number;
}

@Exclude()
export class MenuItemResponseDto {
    @Expose()
    id: string;

    @Expose()
    quantity: number;

    @Expose()
    basePrice: string;

    @Expose()
    finalPrice: string;

    @Expose()
    @Type(() => MenuItemTagResponseDto)
    tags: MenuItemTagResponseDto[];

    @Expose()
    images: string[];

    @Expose()
    @Type(() => MenuItemTranslateResponseDto)
    translates: MenuItemTranslateResponseDto[];

    @Expose()
    discountLevel: string | null;

    @Expose()
    discountMethod: string | null;

    @Expose()
    discountValue: number | null;

    @Expose()
    @Type(() => MenuItemDiscountResponseDto)
    discount?: MenuItemDiscountResponseDto | null;
}