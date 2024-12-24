import { DataSource, Repository, UpdateResult } from "typeorm";
import { GenericService } from "src/common/services/generic.service";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import {  Injectable } from "@nestjs/common";
import { MenuItemDiscount } from "../entities/menu-item-discount.entity";
import { CreateDiscountDto } from "../dtos/menu-item-discount/create-discount.dto";
import { UpdateDiscountDto } from "../dtos/menu-item-discount/update-discount.dto";
import { MenuItemPrice } from "../entities/menu-item-price.entityt";
import { DiscountType } from "../enums/item-menu-discount.enum";

@Injectable()
export class MenuItemDiscountService extends GenericService<MenuItemDiscount> {
    constructor(
        @InjectDataSource() dataSource: DataSource,
        @InjectRepository(MenuItemDiscount)
        readonly menuItemDiscountRepository: Repository<MenuItemDiscount>,
        @InjectRepository(MenuItemPrice)
        readonly menuItemPriceRepository: Repository<MenuItemPrice>,
    ) {
        super(dataSource, MenuItemDiscount, 'discount');
    }

    async createDiscount(createDiscountDto: CreateDiscountDto): Promise<MenuItemDiscount> {
        await this.validateUnique({discountSku: createDiscountDto.discountSku});
        const discount = this.menuItemDiscountRepository.create(createDiscountDto);
        return this.menuItemDiscountRepository.save(discount);
    }

    async updateDiscount(id: number | string, discountDto: UpdateDiscountDto) {
        await this.validateUniqueExcludingSelf({discountSku: discountDto.discountSku});
        const discount = await this.findOneWithoutBuilder(id);
        Object.assign(discount, discountDto);
        return this.menuItemDiscountRepository.save(discount);
    }

    async deleteDiscount(id: string) {
        await this.findOrThrowByUUID(id);
        await this.countDiscountInUse(id);
        await this.softDelete(id);
    }

    async countDiscountInUse(discountId: string): Promise<boolean> {
        const count = await this.menuItemPriceRepository.count({
            where: { discount: { id: discountId } },
            withDeleted: false
        });
        return count > 0;
    }

    async setDiscount(price:number, discount:MenuItemDiscount): Promise<number> { // return the final price after discount
        if(!discount) return price;
        if(discount.discountType === DiscountType.PERCENTAGE){
            return price - (price * discount.discountValue / 100);
        }
        if(discount.discountType === DiscountType.FIXED){
            return price - discount.discountValue;
        }
        return price;
    }
}