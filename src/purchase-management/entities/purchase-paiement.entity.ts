import {  RelationId } from "typeorm";
import { Column, Entity, Index, ManyToOne } from "typeorm";
import { Purchase } from "./purchase.entity";
import { BaseEntity } from "src/common/entities/base.entity";
import { PurchaseLinePaiementStatus } from "../enums/purchase-paiement-status.enum";

@Entity(process.env.DATASET_PREFIX + 'purchase_paiements')
@Index(['id', 'purchase'])
export class PurchasePaiement extends BaseEntity {

    @ManyToOne(() => Purchase, purchase => purchase.purchasePaiements, { onDelete: 'CASCADE' })
    purchase: Purchase;

    @RelationId((purchasePaiement: PurchasePaiement) => purchasePaiement.purchase)
    purchaseId: string;

    @Column({ type: "decimal", precision: 10, scale: 2 })
    amount: number;

    @Column({ type: "date", nullable: true })
    datePaiement: Date;

    @Column({ type: "varchar", length: 255, nullable: true })
    reference: string;

    @Column({ enum: PurchaseLinePaiementStatus, default: PurchaseLinePaiementStatus.UNPAID })
    status: PurchaseLinePaiementStatus;
}