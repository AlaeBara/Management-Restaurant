import { DataSource, Repository, UpdateResult } from "typeorm";
import { GenericService } from "src/common/services/generic.service";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { BadRequestException, Injectable } from "@nestjs/common";
import { MenuItemDiscount } from "../entities/menu-item-discount.entity";
import { CreateDiscountDto } from "../dtos/menu-item-discount/create-discount.dto";
import { UpdateDiscountDto } from "../dtos/menu-item-discount/update-discount.dto";
import { MenuItemPrice } from "../entities/menu-item-price.entityt";
import { DiscountMethod } from "../enums/discount-method";
import { DiscountType } from "../enums/discount-type.enum";

@Injectable()
export class MenuItemDiscountService extends GenericService<MenuItemDiscount> {
    constructor(
        @InjectDataSource() dataSource: DataSource,
        @InjectRepository(MenuItemDiscount)
        readonly discountRepository: Repository<MenuItemDiscount>,
        @InjectRepository(MenuItemPrice)
        readonly priceRepository: Repository<MenuItemPrice>,
    ) {
        super(dataSource, MenuItemDiscount, 'discount');
    }

    async validateTime(startTime: string, endTime: string){
        const [startHours, startMinutes] = startTime.split(':').map(Number);
        const [endHours, endMinutes] = endTime.split(':').map(Number);
        
        if (startHours > endHours || (startHours === endHours && startMinutes >= endMinutes)) {
            throw new BadRequestException('L\'heure de début doit être antérieure à l\'heure de fin');
        }
    }

    async validateDate(startDate: Date, endDate: Date){
        const startDateFormatted = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
        const endDateFormatted = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
        if (startDateFormatted > endDateFormatted) {
            throw new BadRequestException('La date de début doit être antérieure à la date de fin');
        }
    }

    async createDiscount(createDiscountDto: CreateDiscountDto): Promise<MenuItemDiscount> {
        await this.validateUnique({ discountSku: createDiscountDto.discountSku });
        const discount = this.discountRepository.create(createDiscountDto);

        switch (discount.discountType) {
            case DiscountType.PERIOD:
                if (!discount.activeDays || discount.activeDays.length === 0) // if the discount is a period discount, the active days are required
                    throw new BadRequestException('Les jours actifs sont requis pour les réductions à horaires spécifiques de type quotidien');
                if (discount.specificTime) {
                    if (!discount.startTime || !discount.endTime) // if the discount specific time is true, the start time and end time are required
                        throw new BadRequestException('L\'heure de début et l\'heure de fin sont requises pour les réductions à horaires spécifiques de type quotidien');
                    await this.validateTime(discount.startTime, discount.endTime);
                }
                break;
            case DiscountType.LIMITED_DATE:
                if (discount.activeDays && discount.activeDays.length > 0)  // if the discount is a limited date discount, the active days are not required
                    throw new BadRequestException('Les jours actifs ne sont pas requis pour les réductions à ce type de dates limites');
                if (!discount.startDate || !discount.endDate) // if the discount is a limited date discount, the start date and end date are required
                    throw new BadRequestException('La date de début et la date de fin sont requises pour les réductions à ce type de dates limites');
                await this.validateDate(discount.startDate, discount.endDate);
                if (discount.specificTime) {
                    if (!discount.startTime || !discount.endTime) // if the discount specific time is true, the start time and end time are required
                        throw new BadRequestException('L\'heure de début et l\'heure de fin sont requises pour les réductions à horaires spécifiques de type date limite');
                    await this.validateTime(discount.startTime, discount.endTime);
                }
                break;
            case DiscountType.QUANTITY:
                if (!discount.usageQuota) // if the discount is a quantity discount, the usage quota is required
                    throw new BadRequestException('Le quota d\'utilisation est requis pour les réductions basées sur la quantité');
                if (discount.usageQuota && discount.usageQuota <= 0) // if the discount is a quantity discount, the usage quota must be greater than 0
                    throw new BadRequestException('Le quota d\'utilisation doit être supérieur à 0');
                break;
        }

        return this.discountRepository.save(discount);
    }

    async updateDiscount(id: number | string, discountDto: UpdateDiscountDto) {
        await this.validateUniqueExcludingSelf({ discountSku: discountDto.discountSku });
        const discount = await this.findOneWithoutBuilder(id);
        Object.assign(discount, discountDto);
        return this.discountRepository.save(discount);
    }

    async deleteDiscount(id: string) {
        await this.findOrThrowByUUID(id);
        await this.countDiscountInUse(id);
        await this.softDelete(id);
    }

    async countDiscountInUse(discountId: string): Promise<boolean> {
        const count = await this.priceRepository.count({
            where: { discount: { id: discountId } },
            withDeleted: false
        });
        return count > 0;
    }

    async setDiscount(price: number, discount: MenuItemDiscount): Promise<number> { // return the final price after discount
        if (!discount) return price;
        if (discount.discountMethod === DiscountMethod.PERCENTAGE) {
            return price - (price * discount.discountValue / 100);
        }
        if (discount.discountMethod === DiscountMethod.FIXED) {
            return price - discount.discountValue;
        }
        return price;
    }
}