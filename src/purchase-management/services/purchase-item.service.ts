import { Injectable } from "@nestjs/common";
import { PurchaseItem } from "../entities/purchase-item.entity";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { GenericService } from "src/common/services/generic.service";

@Injectable()
export class PurchaseItemService extends GenericService<PurchaseItem> {
    constructor(
        @InjectDataSource() dataSource: DataSource,
        @InjectRepository(PurchaseItem)
        private readonly purchaseItemRepository: Repository<PurchaseItem>,
    ) {
        super(dataSource, PurchaseItem, 'Ligne de commande d\'achat');
    }
}