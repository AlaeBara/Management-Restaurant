import { BaseEntity } from "src/common/entities/base.entity";
import { AfterLoad, Column, Entity, Index, JoinColumn, ManyToOne, RelationId } from "typeorm";
import { Category } from "./category.entity";
import { ProductType } from "../enums/type.enum";
import { Unit } from "src/unit-management/entities/unit.entity";
import { Exclude } from "class-transformer";


@Entity(process.env.DATASET_PREFIX + 'products')
@Index(['productSKU', 'productName', 'productUnit'])
export class Product extends BaseEntity {

    @Column({ type: 'varchar', length: 15 })
    productSKU: string;

    @Column({ type: 'varchar', length: 75 })
    productName: string;

    @Column({ type: 'text' })
    productDescription: string;

    @Column({ type: 'varchar', nullable: true })
    barcode: string;

    @Column({ type: 'boolean', default: false })
    isOffered: boolean;

    @Column({ type: 'enum', enum: ProductType })
    productType: ProductType;

    @ManyToOne(() => Unit, { nullable: true, eager: true })
    @JoinColumn({ name: 'unitId' })
    private productUnit: Unit;

    unit: string;

    @AfterLoad()
    getUnit(): void {
        this.unit = this.productUnit?.unit;
        delete this.productUnit;
    }

    public setProductUnit(unit: Unit): void {
        this.productUnit = unit;
    }

    public getProductUnit(): Unit {
        return this.productUnit;
    }
}