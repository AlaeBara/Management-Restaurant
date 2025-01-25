import { Injectable } from '@nestjs/common';

import { ClientPermissionSeeder } from 'src/client-management/seeders/client-permission.seeder';
import { SupplierPermissionsSeeder } from 'src/supplier-management/seeders/supplier-permissions.seeder';
import { UnitPermissionsSeeder } from 'src/unit-management/seeders/unit-permissions.seeder';
import { AccessRolePermissionSeeder } from 'src/user-management/seeders/access-role-permission.seeder';
import { RolePermissionSeeder } from 'src/user-management/seeders/role-permission.seeder';
import { RolesSeeder } from 'src/user-management/seeders/role.seeder';
import { UserPermissionSeeder } from 'src/user-management/seeders/user-permission.seeder';
import { TablePermissionSeeder } from 'src/zone-table-management/seeders/table-permissions.dto';
import { ZonePermissionSeeder } from 'src/zone-table-management/seeders/zone-permissions.dto';
import { StoragePermissionSeeder } from 'src/storage-management/seeders/storage-permissions.dto';
import { InventoryMovementPermissionSeeder } from 'src/inventory-managemet/seeders/inventory-movement-permissions.seeder';
import { InventoryPermissionSeeder } from 'src/inventory-managemet/seeders/inventory-permission.seeder';
import { ProductPermissionSeeder } from 'src/product-management/seeders/product-permission.seeder';
import { ShiftZonePermissionSeeder } from 'src/shift-zone-management/seeders/shift.permission';
import { FundPermissionSeeder } from 'src/fund-management/seeders/fund.seeder';
import { OperationsPermissionSeeder } from 'src/fund-management/seeders/operation.seeder';
import { PurchasePermissionSeeder } from 'src/purchase-management/seeders/purchase.seeder';
import { LanguageSeeder } from 'src/language-management/seeders/language.seeder';
import { CategoryPermissionSeeder } from 'src/category-management/seeders/category-permission.seeder';
import { TagSeeder } from 'src/menu-item-management/seeders/tag.seeder';
import { PaymentMethodSeeder } from 'src/payment-management/seeders/payment-method.seeder';
@Injectable()
export class MasterSeeder {

    constructor(
        private readonly accessRolePermissionSeeder: AccessRolePermissionSeeder,
        private readonly rolePermissionSeeder: RolePermissionSeeder,
        private readonly userPermissionSeeder: UserPermissionSeeder,
        private readonly rolesSeeder: RolesSeeder,
        private readonly tablePermissionSeeder: TablePermissionSeeder,
        private readonly zonePermissionSeeder: ZonePermissionSeeder,
        private readonly clientPermissionSeeder: ClientPermissionSeeder,
        private readonly unitPermissionsSeeder: UnitPermissionsSeeder,
        private readonly supplierPermissionsSeeder: SupplierPermissionsSeeder,
        private readonly storagePermissionSeeder: StoragePermissionSeeder,
        private readonly inventoryPermissionSeeder: InventoryPermissionSeeder,
        private readonly inventoryMovementPermissionSeeder: InventoryMovementPermissionSeeder,
        private readonly categoryPermissionSeeder: CategoryPermissionSeeder,
        private readonly productPermissionSeeder: ProductPermissionSeeder,
        private readonly shiftZonePermissionSeeder: ShiftZonePermissionSeeder,
        private readonly fundPermissionSeeder: FundPermissionSeeder,
        private readonly operationsPermissionSeeder: OperationsPermissionSeeder,
        private readonly purchasePermissionSeeder: PurchasePermissionSeeder,
        private readonly languageSeeder: LanguageSeeder,
        private readonly tagSeeder: TagSeeder,
        private readonly paymentMethodSeeder: PaymentMethodSeeder

    ) { }

    async seedAll() {
        await this.rolesSeeder.seed();
        await this.rolePermissionSeeder.seed();
        await this.userPermissionSeeder.seed();
        await this.accessRolePermissionSeeder.seed();
        await this.tablePermissionSeeder.seed();
        await this.zonePermissionSeeder.seed();
        await this.clientPermissionSeeder.seed();
        await this.unitPermissionsSeeder.seed();
        await this.supplierPermissionsSeeder.seed();
        await this.storagePermissionSeeder.seed();
        await this.inventoryPermissionSeeder.seed();
        await this.inventoryMovementPermissionSeeder.seed();
        await this.categoryPermissionSeeder.seed();
        await this.productPermissionSeeder.seed();
        await this.shiftZonePermissionSeeder.seed();
        await this.fundPermissionSeeder.seed();
        await this.operationsPermissionSeeder.seed();
        await this.purchasePermissionSeeder.seed();
        await this.languageSeeder.seed();
        await this.tagSeeder.seed();
        await this.paymentMethodSeeder.seed();
        console.log('All seeders executed');
    }
}
