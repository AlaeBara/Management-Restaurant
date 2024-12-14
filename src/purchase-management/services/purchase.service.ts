import { GenericService } from "src/common/services/generic.service";
import { Purchase } from "../entities/purchase.entity";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { PurchaseItem } from "../entities/purchase-item.entity";
import { DataSource, Repository } from "typeorm";
import { CreatePurchaseDto } from "../dtos/create-purchase.dto";
import { BadRequestException, forwardRef, Inject, NotFoundException } from "@nestjs/common";
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

export class PurchaseService extends GenericService<Purchase> {

    constructor(
        @InjectDataSource() dataSource: DataSource,
        @InjectRepository(Purchase)
        private readonly purchaseRepository: Repository<Purchase>,
        @InjectRepository(PurchaseItem)
        private readonly purchaseItemRepository: Repository<PurchaseItem>,
        @Inject(FundService)
        private readonly fundService: FundService,
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
            purchaseItems: purchaseItems
        });

        return this.purchaseRepository.save(purchase);
    }

    async deleteItem(purchaseItemId: string) {
        const purchaseItem = await this.purchaseItemService.findOrThrowByUUID(purchaseItemId);
        const purchase = await this.findOrThrowByUUID(purchaseItem.purchaseId);
        if (purchaseItem.status !== PurchaseItemStatus.PENDING) throw new BadRequestException('La ligne de commande est déjà en traitement');
        await this.purchaseItemRepository.remove(purchaseItem);
        await this.recalculatePurchase(purchaseItem.purchaseId);
        await this.updatePurchaseStatus(purchaseItem.purchaseId);
    }

    async addItem(createPurchaseItemDto: CreatePurchaseItemDto, purchaseId: string) {
        const purchase = await this.findOrThrowByUUID(purchaseId);
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
        return this.purchaseRepository.save(purchase);
    }

    async executePurchaseMovement(executePurchaseMovementDto: ExecutePurchaseMovementDto, request: Request) {
        const purchase = await this.findOrThrowByUUID(executePurchaseMovementDto.purchaseId);
        const purchaseItem = purchase.purchaseItems.find(item => item.id === executePurchaseMovementDto.purchaseItemId);
        if (!purchaseItem) throw new NotFoundException('La ligne de commande n\'existe pas');
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
        await this.updatePurchaseStatus(purchase.id);
    }

    async updatePurchaseStatus(purchaseId: string) {
        const purchase = await this.findOrThrowByUUID(purchaseId);
        const allCompleted = purchase.purchaseItems.every(item => item.status === PurchaseItemStatus.COMPLETED);
        console.log('allCompleted', allCompleted);
        if (allCompleted) {
            purchase.status = PurchaseStatus.COMPLETED;
            return this.purchaseRepository.save(purchase);
        }

        const hasPartial = purchase.purchaseItems.some(item => [PurchaseItemStatus.PARTIAL, PurchaseItemStatus.PENDING].includes(item.status));
        console.log('hasPartial', hasPartial);
        if (hasPartial) {
            purchase.status = PurchaseStatus.DELIVERING;
            return this.purchaseRepository.save(purchase);
        }
    }
}


