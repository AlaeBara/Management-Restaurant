import { BaseEntity } from "src/common/entities/base.entity";
import { AfterLoad, Column, Entity, Index, ManyToOne, RelationId, Unique } from "typeorm";
import { CategoryStatus } from "../enums/category-status.enum";



@Entity('categories')
@Index(['categoryCode', 'categoryName', 'parentCategory'])
export class Category extends BaseEntity {

    @Column({ type: 'varchar', length: 50 })
    categoryName: string;

    @Column({ type: 'varchar', length: 15 })
    categoryCode: string;

    @Column({ type: 'text' })
    categoryDescription: string;

    @ManyToOne(() => Category, { nullable: true })
    parentCategory: Category;

    @RelationId((category: Category) => category.parentCategory)
    parentCategoryId: string;

    @Column({ type: 'boolean', default: false })
    isTimeRestricted: boolean;

    @Column({ type: 'time', nullable: true })
    activeTimeStart: Date;

    @Column({ type: 'time', nullable: true })
    activeTimeEnd: Date;

    @Column('simple-array', { nullable: true })
    activeDays: string[];

    @Column({ type: 'boolean', default: true })
    isActive: boolean;

    status: CategoryStatus; // New property (not a column)

    @AfterLoad()
    calculateStatus() {
        if (!this.isActive) {
            this.status = CategoryStatus.INACTIVE;
            return;
        }

        if (!this.isTimeRestricted) {
            this.status = CategoryStatus.ACTIVE;
            return;
        }

        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();
        const startMinutes = this.timeToMinutes(this.activeTimeStart);
        const endMinutes = this.timeToMinutes(this.activeTimeEnd);
        const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

        const isTimeValid = startMinutes <= endMinutes
            ? currentMinutes >= startMinutes && currentMinutes <= endMinutes
            : currentMinutes >= startMinutes || currentMinutes <= endMinutes;

        const isDayValid = this.activeDays.includes(currentDay);

        this.status = (isTimeValid && isDayValid) 
            ? CategoryStatus.TIME_RESTRICTED 
            : CategoryStatus.OUTSIDE_SCHEDULE;
    }

    private timeToMinutes(time: Date | string): number {
        if (!time) return 0;
        
        if (typeof time === 'string') {
            const [hours, minutes] = time.split(':').map(Number);
            return hours * 60 + minutes;
        }
        
        return time.getHours() * 60 + time.getMinutes();
    }
}
