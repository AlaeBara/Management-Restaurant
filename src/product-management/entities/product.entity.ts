import { BaseEntity } from "src/common/entities/base.entity";
import { Column, Entity, Index, JoinColumn, ManyToOne, RelationId } from "typeorm";
import { Category } from "./category.entity";
import { ProductType } from "../enums/type.enum";
import { Unit } from "src/unit-management/entities/unit.entity";


@Entity('products')
@Index(['productSKU', 'productName'])
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

    // Defines the type of product
    @Column({ type: 'enum', enum: ProductType })
    productType: ProductType;   
/* 
    // Defines the relationship with Category
    @ManyToOne(() => Category, { nullable: false })
    @JoinColumn({ name: 'categoryId' })
    productCategory: Category;

    // Automatically loads the foreign key
    @RelationId((product: Product) => product.productCategory)
    categoryId: string; */

    // Gets active status from the category
    /* get isActive(): boolean {
        return this.productCategory?.isActive ?? false;
    } */

    @ManyToOne(() => Unit, { nullable: true })
    @JoinColumn({ name: 'unitId' }) 
    productUnit: Unit;

    @RelationId((product: Product) => product.productUnit)
    unitId: string;
}