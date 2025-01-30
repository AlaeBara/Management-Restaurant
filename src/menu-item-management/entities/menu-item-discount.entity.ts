import { BaseEntity } from "src/common/entities/base.entity";
import { AfterLoad, Column, Entity } from "typeorm";
import { DiscountType } from "../enums/discount-type.enum";
import { DiscountMethod } from "../enums/discount-method.enum";
import { DiscountStatus } from "../enums/discount-status.enum";

@Entity(`${process.env.DATASET_PREFIX || ''}item_menu_discount`)
export class MenuItemDiscount extends BaseEntity {

    @Column({ type: 'varchar', length: 15 })
    discountSku: string;

    @Column({ type: 'varchar', default: DiscountMethod.PERCENTAGE })
    discountMethod: DiscountMethod;

    @Column({ type: 'numeric', precision: 10, scale: 2 })
    discountValue: number;

    @Column({ type: 'boolean', default: true })
    isActive: boolean;

    @Column({ type: 'varchar' })
    discountType: DiscountType;

    //if discountType is quantity
    @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
    usageQuota: number;

    //if discountType is limitedDate
    @Column({ type: 'date', nullable: true })
    startDate: Date;

    //if discountType is limitedDate
    @Column({ type: 'date', nullable: true })
    endDate: Date;

    @Column({ type: 'boolean', default: false })
    specificTime: boolean;

    //if specificTime is true then this is required
    @Column({ type: 'time', nullable: true })
    startTime: string;

    //if specificTime is true then this is required
    @Column({ type: 'time', nullable: true })
    endTime: string;

    //if discountType is period
    @Column('simple-array', { nullable: true })
    activeDays: string[];

    status: DiscountStatus = DiscountStatus.NO_DISCOUNT;


    @AfterLoad()
    calculateStatus() {
        if (!this.isActive) {
            this.status = DiscountStatus.NO_DISCOUNT;
            return;
        }

        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();
        const startMinutes = this.timeToMinutes(this.startTime);
        const endMinutes = this.timeToMinutes(this.endTime);
        const currentDay = this.capitalizeFirstLetter(
            new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(now)
        );


        if (this.discountType === DiscountType.REGULARLY) {
            if (!this.activeDays) {
                this.status = DiscountStatus.NO_DISCOUNT;
                return;
            }
            if (this.activeDays.includes(currentDay)) {
                if (this.specificTime) {
                    if (currentMinutes >= startMinutes && currentMinutes <= endMinutes) {
                        this.status = DiscountStatus.IN_DISCOUNT;
                        return;
                    }
                    this.status = DiscountStatus.NO_DISCOUNT;
                    return;
                }
                this.status = DiscountStatus.IN_DISCOUNT;
                return;
            }
        }

        if (this.discountType === DiscountType.LIMITED_DATE) {
            const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const startDateTime = new Date(this.startDate);
            const endDateTime = new Date(this.endDate);

            // Set end date to end of day for inclusive comparison
            endDateTime.setHours(23, 59, 59, 999);

            if (nowDate >= startDateTime && nowDate <= endDateTime) {
                switch (this.specificTime) {
                    case true:
                        if (currentMinutes >= startMinutes && currentMinutes <= endMinutes) {
                            this.status = DiscountStatus.IN_DISCOUNT;
                            return;
                        }
                        this.status = DiscountStatus.NO_DISCOUNT;
                        return;
                    case false:
                        this.status = DiscountStatus.IN_DISCOUNT;
                        return;
                }
            }
        }

        if(this.discountType === DiscountType.QUANTITY){
            if(this.usageQuota && this.usageQuota > 0){
                this.status = DiscountStatus.IN_DISCOUNT;
                return;
            }
        }

        this.status = DiscountStatus.NO_DISCOUNT;
        return;

        //handel Membership discount
    }

    private timeToMinutes(time: Date | string): number {
        if (!time) return 0;

        if (typeof time === 'string') {
            const [hours, minutes] = time.split(':').map(Number);
            return hours * 60 + minutes;
        }

        return time.getHours() * 60 + time.getMinutes();
    }

    private capitalizeFirstLetter(string: string): string {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    public async setDiscount(price: number): Promise<number> {
        return this.discountMethod === DiscountMethod.PERCENTAGE
            ? price * (1 - this.discountValue / 100)
            : price - this.discountValue;
    }
}