import { Injectable } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { GenericService } from "src/common/services/generic.service";
import { PurchasePaiement } from "../entities/purchase-paiement.entity";

@Injectable()
export class PurchasePaiementService extends GenericService<PurchasePaiement> {
    constructor(
        @InjectDataSource() dataSource: DataSource,
        @InjectRepository(PurchasePaiement)
        readonly purchasePaiementRepository: Repository<PurchasePaiement>,
    ) {
        super(dataSource, PurchasePaiement, 'Paiement d\'achat');
    }
}