import { GenericService } from "src/common/services/generic.service";
import { Purchase } from "../entities/purchase.entity";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { PurchaseItem } from "../entities/purchase-item.entity";
import { DataSource, Repository } from "typeorm";
import { CreatePurchaseDto } from "../dtos/create-purchase.dto";
import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { FundService } from "src/fund-management/services/fund.service";
import { SupplierService } from "src/supplier-management/services/supplier.service";
import { UserService } from "src/user-management/services/user/user.service";
import { ProductService } from "src/product-management/services/product.service";
import { InventoryService } from "src/inventory-managemet/services/inventory.service";
import { PurchaseItemStatus } from "../enums/purchase-product-inventory-action-status.enum";
import { PurchaseItemService } from "./purchase-item.service";
import { ExecutePurchaseMovementDto } from "../dtos/execute-purchase-movement.dto";
import { InventoryMovementService } from "src/inventory-managemet/services/inventory-movement.service";
import { CreateInventoryMovementDto } from "src/inventory-managemet/dtos/inventory-movement/create-inventory-movement.dto";
import { MovementType } from "src/inventory-managemet/enums/movement_type.enum";
import { PurchaseStatus } from "../enums/purchase-status.enum";
import { CreatePurchaseItemDto } from "../dtos/create-purchase-item.dto";
import { PurchasePaiementService } from "./purchase-paiement.service";
import { PurchaseLinePaiementStatus, PurchasePaiementStatus } from "../enums/purchase-paiement-status.enum";
import { CreatePurchasePaiementDto } from "../dtos/create-purchase-paiement.dto";
import { FundOperationService } from "src/fund-management/services/fund-operation.service";
import { FundOperation, FundOperationStatus } from "src/fund-management/enums/fund-operation.enum";
import { CreateFundOperationDto } from "src/fund-management/dtos/fund-operation/create-fund-operation.dto";
import { PurchasePaiement } from "../entities/purchase-paiement.entity";

@Injectable()
export class PurchaseService extends GenericService<Purchase> {

    constructor(
        @InjectDataSource() dataSource: DataSource,
        @InjectRepository(Purchase)
        private readonly purchaseRepository: Repository<Purchase>,
        @InjectRepository(PurchaseItem)
        private readonly purchaseItemRepository: Repository<PurchaseItem>,
        @Inject(FundService)
        private readonly fundService: FundService,
        @Inject(FundOperationService)
        private readonly fundOperationService: FundOperationService,
        @Inject(SupplierService)
        private readonly supplierService: SupplierService,
        @Inject(UserService)
        private readonly userService: UserService,
        @Inject(ProductService)
        private readonly productService: ProductService,
        @Inject(InventoryService)
        private readonly inventoryService: InventoryService,
        @Inject(PurchaseItemService)
        private readonly purchaseItemService: PurchaseItemService,
        @Inject(InventoryMovementService)
        private readonly inventoryMovementService: InventoryMovementService,
        @Inject(PurchasePaiementService)
        private readonly purchasePaiementService: PurchasePaiementService,
    ) {
        super(dataSource, Purchase, 'Commande d\'achat');
    }

    async createPurchase(createPurchaseDto: CreatePurchaseDto, request: Request) {
        await this.validateUnique({
            supplierReference: createPurchaseDto.supplierReference,
            ownerReferenece: createPurchaseDto.ownerReferenece
        });

        const purchaseItems = await Promise.all(createPurchaseDto.items.map(async item => {
            const purchaseItem = this.purchaseItemRepository.create({
                ...item,
                product: await this.productService.findOrThrowByUUID(item.productId),
                inventory: await this.inventoryService.findOrThrowByUUID(item.inventoryId)
            });
            return purchaseItem;
        }));

        const purchase = this.purchaseRepository.create({
            ...createPurchaseDto,
            supplier: await this.supplierService.findOrThrowByUUID(createPurchaseDto.supplierId),
            sourcePayment: await this.fundService.findOrThrowByUUID(createPurchaseDto.sourcePaymentId),
            createdBy: await this.userService.findOrThrowByUUID(request['user'].sub),
            purchaseDate: new Date(createPurchaseDto.purchaseDate),
            purchaseItems: purchaseItems,
            totalRemainingAmount: createPurchaseDto.totalAmountTTC
        });

        return this.purchaseRepository.save(purchase);
    }

    private async validatePurchasePaymentStatus(purchase: Purchase) {
        if (purchase.paiementStatus === PurchasePaiementStatus.PAID) {
            throw new BadRequestException('La commande est déjà payée');
        }
        if (purchase.paiementStatus === PurchasePaiementStatus.PARTIALLY_PAID) {
            throw new BadRequestException('La commande est déjà partiellement payée');
        }
    }

    private async validatePurchaseStatus(purchase: Purchase) {
        if (purchase.status !== PurchaseStatus.CREATED) {
            throw new BadRequestException('La commande doit être en statut créé pour modifier les produits')
        }
    }

    async deleteItem(purchaseItemId: string) {
        const purchaseItem = await this.purchaseItemService.findOrThrowByUUID(purchaseItemId);
        const purchase = await this.findOrThrowByUUID(purchaseItem.purchaseId);
        await this.validatePurchasePaymentStatus(purchase);
        if (purchaseItem.status !== PurchaseItemStatus.PENDING) throw new BadRequestException('La ligne de commande est déjà en traitement');
        await this.purchaseItemRepository.remove(purchaseItem);
        await this.recalculatePurchase(purchaseItem.purchaseId);
        await this.updatePurchaseStatus(purchaseItem.purchaseId);
    }

    async addItem(createPurchaseItemDto: CreatePurchaseItemDto, purchaseId: string) {
        const purchase = await this.findOrThrowByUUID(purchaseId);
        await this.validatePurchasePaymentStatus(purchase);
        purchase.purchaseItems.push(this.purchaseItemRepository.create({
            ...createPurchaseItemDto,
            purchase: purchase,
            product: await this.productService.findOrThrowByUUID(createPurchaseItemDto.productId),
            inventory: await this.inventoryService.findOrThrowByUUID(createPurchaseItemDto.inventoryId)
        }));
        await this.purchaseRepository.save(purchase);
        await this.recalculatePurchase(purchaseId);
        await this.updatePurchaseStatus(purchaseId);
    }

    async recalculatePurchase(purchaseId: string) {
        const purchase = await this.findOrThrowByUUID(purchaseId);
        purchase.totalAmountHT = purchase.purchaseItems.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
        purchase.totalAmountTTC = purchase.totalAmountHT * (1 + purchase.taxPercentage / 100);
        await this.applyDiscount(purchase);
        purchase.totalRemainingAmount = purchase.totalAmountTTC;
        return this.purchaseRepository.save(purchase);
    }

    async applyDiscount(purchase: Purchase) {
        if (purchase.discountType === 'percentage') {
            purchase.totalAmountTTC = purchase.totalAmountTTC * (1 - purchase.discountValue / 100);
        } else {
            purchase.totalAmountTTC = purchase.totalAmountTTC - purchase.discountValue;
        }
    }

    async executePurchaseMovement(executePurchaseMovementDto: ExecutePurchaseMovementDto, purchaseItemId: string, request: Request) {
        const purchaseItem = await this.purchaseItemService.findOrThrowByUUID(purchaseItemId);
        const purchase = await this.findOneByIdWithOptions(purchaseItem.purchaseId, {
            select: ['supplierReference', 'ownerReferenece']
        })
        console.log("asdadsasd", purchase)
        const inventoryMovementDto: CreateInventoryMovementDto = {
            inventoryId: purchaseItem.inventory.id,
            destinationInventoryId: null,
            quantity: Number(executePurchaseMovementDto.quantityToMove),
            movementAction: 'increase',
            movementType: MovementType.PURCHASE,
            movementDate: new Date(),
            dateExpiration: null,
            notes: 'Commande d\'achat de référence ' + purchase.supplierReference + ' - notre référence :' + purchase.ownerReferenece,
            reason: 'Commande d\'achat'
        }
        if (executePurchaseMovementDto.quantityToMove + executePurchaseMovementDto.quantityToReturn > purchaseItem.quantityInProgress) throw new BadRequestException('La quantité à déplacer est supérieure à la quantité totale de la commande');

        await this.inventoryMovementService.createInvenotryMovement(inventoryMovementDto, request);


        purchaseItem.quantityInProgress = Number(purchaseItem.quantityInProgress) - Number(executePurchaseMovementDto.quantityToMove);
        purchaseItem.quantityMoved = Number(purchaseItem.quantityMoved) + Number(executePurchaseMovementDto.quantityToMove);

        purchaseItem.quantityInProgress = Number(purchaseItem.quantityInProgress) - Number(executePurchaseMovementDto.quantityToReturn);
        purchaseItem.quantityReturned = Number(purchaseItem.quantityReturned) + Number(executePurchaseMovementDto.quantityToReturn);

        await this.purchaseItemRepository.save(purchaseItem);
        await this.updatePurchaseStatus(purchaseItem.purchaseId);
        await this.updatePurchasePaiementStatus(purchaseItem.purchaseId);
    }

    async updatePurchaseStatus(purchaseId: string) {
        const purchase = await this.findOrThrowByUUID(purchaseId);

        const allCompleted = purchase.purchaseItems.every(item => item.status === PurchaseItemStatus.COMPLETED);
        if (allCompleted) {
            purchase.status = PurchaseStatus.COMPLETED;
            return this.purchaseRepository.save(purchase);
        }

        const allPENDING = purchase.purchaseItems.every(item => item.status === PurchaseItemStatus.PENDING);
        if (allPENDING) {
            purchase.status = PurchaseStatus.CREATED;
            return this.purchaseRepository.save(purchase);
        }

        const hasPartial = purchase.purchaseItems.some(item => [PurchaseItemStatus.PARTIAL, PurchaseItemStatus.PENDING].includes(item.status));
        if (hasPartial) {
            purchase.status = PurchaseStatus.DELIVERING;
            return this.purchaseRepository.save(purchase);
        }
    }

    async updatePurchasePaiementStatus(purchaseId: string) {
        const purchase = await this.findOrThrowByUUID(purchaseId);
        
        const hasPartial = purchase.purchasePaiements.some(paiement => paiement.status === PurchaseLinePaiementStatus.PAID);
        if (hasPartial && purchase.totalRemainingAmount > 0) {
            purchase.paiementStatus = PurchasePaiementStatus.PARTIALLY_PAID;
            return this.purchaseRepository.save(purchase);
        }

        const allPaid = purchase.purchasePaiements.every(paiement => paiement.status === PurchaseLinePaiementStatus.PAID);
        if (allPaid && purchase.totalRemainingAmount == 0) {
            purchase.paiementStatus = PurchasePaiementStatus.PAID;
            return this.purchaseRepository.save(purchase);
        }
        
    }

    async deletePurchase(purchaseId: string) {
        const purchase = await this.findOrThrowByUUID(purchaseId);
        if (purchase.status !== PurchaseStatus.CREATED) throw new BadRequestException('La commande n\'est est deja en traitement');
        await this.purchaseRepository.remove(purchase);
    }

    async generatePaiement(createPurchasePaiementDto: CreatePurchasePaiementDto, purchaseId: string, request: Request) {
        const purchase = await this.findOrThrowByUUID(purchaseId);
        const purchasePaiement = await this.purchasePaiementService.purchasePaiementRepository.create({
            purchase: purchase,
            amount: createPurchasePaiementDto.amount,
            status: createPurchasePaiementDto.status,
            reference: createPurchasePaiementDto.reference,
            datePaiement: createPurchasePaiementDto.datePaiement
        });
        if(await this.isPurchasePaid(purchase)) throw new BadRequestException('La commande est déjà payée');
        await this.isAmountValid(Number(createPurchasePaiementDto.amount), purchase);
        if (createPurchasePaiementDto.status && createPurchasePaiementDto.status === PurchaseLinePaiementStatus.PAID) {
            await this.executePaiement(purchase.id, request, createPurchasePaiementDto.amount, createPurchasePaiementDto.reference);
            await this.updatePurchasePaiementStatus(purchase.id);
        }
        await this.purchasePaiementService.purchasePaiementRepository.save(purchasePaiement);
    }

    async isAmountValid(amount: number, purchase: Purchase) {
        const TotalCreatedPaiements = purchase.purchasePaiements.reduce((acc, paiement) => acc + Number(paiement.amount), 0);
        if (Number(amount) > Number(purchase.totalRemainingAmount)) throw new BadRequestException('Le montant du paiement est supérieur au montant restant à payer');
        if(TotalCreatedPaiements+amount > purchase.totalAmountTTC) throw new BadRequestException('Le montant du paiement en total est supérieur au montant total de la commande');
        if(amount > purchase.totalAmountTTC) throw new BadRequestException('Le montant du paiement est supérieur au montant restant à payer');
        if(amount < 0) throw new BadRequestException('Le montant du paiement ne peut pas être négatif');
        if(amount === 0) throw new BadRequestException('Le montant du paiement ne peut pas être égal à 0');
    }

    async isPurchasePaid(purchase: Purchase) {
        if(purchase.totalRemainingAmount === 0 || purchase.paiementStatus === PurchasePaiementStatus.PAID) return true;
        return false;
    }

    async confirmPaiement(purchasePaiementId: string, request: Request) {
        const purchasePaiement = await this.purchasePaiementService.findOrThrowByUUID(purchasePaiementId);
        const purchase = await this.findOrThrowByUUID(purchasePaiement.purchaseId);
        if (purchasePaiement.status && purchasePaiement.status === PurchaseLinePaiementStatus.PAID) throw new BadRequestException('Le paiement est déjà effectué');
        if (Number(purchasePaiement.amount) > Number(purchase.totalRemainingAmount)) throw new BadRequestException('Le montant du paiement est supérieur au montant restant à payer');
        await this.executePaiement(purchase.id, request, purchasePaiement.amount, purchasePaiement.reference);
        await this.markedPaiementAsPaid(purchasePaiement);
        await this.updatePurchasePaiementStatus(purchase.id);
    }

    async markedPaiementAsPaid(purchasePaiement: PurchasePaiement) {
        purchasePaiement.status = PurchaseLinePaiementStatus.PAID;
        await this.purchasePaiementService.purchasePaiementRepository.save(purchasePaiement);
    }

    async executePaiement(purchaseId: string, request: Request, amount: number, reference: string) {
        const purchase = await this.findOrThrowByUUID(purchaseId);
        const motif = 'Paiement de la commande d\'achat de référence ' + purchase.supplierReference + ' - notre référence :' + purchase.ownerReferenece;
        const fundOperation: CreateFundOperationDto = {
            fundId: purchase.sourcePayment.id,
            amount: amount,
            operationAction: 'decrease',
            operationType: FundOperation.PAYMENT,
            status: FundOperationStatus.APPROVED,
            reference: reference || motif,
            dateOperation: new Date(),
            note: motif
        }
        await this.fundOperationService.createOperation(fundOperation, request);
        purchase.totalPaidAmount = Number(purchase.totalPaidAmount) + Number(amount);
        purchase.totalRemainingAmount = Number(purchase.totalAmountTTC) - Number(purchase.totalPaidAmount);
        await this.purchaseRepository.save(purchase);
        await this.updatePurchasePaiementStatus(purchase.id);
    }

}

