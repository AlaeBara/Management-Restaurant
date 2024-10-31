// src/database/seeder.service.ts
import { Injectable } from '@nestjs/common';
import { ClientPermissionSeeder } from 'src/client-management/seeders/client-permission.seeder';
import { AccessRolePermissionSeeder } from 'src/user-management/seeders/access-role-permission.seeder';
import { PermissionPermissionsSeeder } from 'src/user-management/seeders/permission-permissions.seeder';
import { RolePermissionSeeder } from 'src/user-management/seeders/role-permission.seeder';
import { RolesSeeder } from 'src/user-management/seeders/role.seeder';
import { UserPermissionSeeder } from 'src/user-management/seeders/user-permission.seeder';
import { TablePermissionSeeder } from 'src/zone-table-management/seeders/table-permissions.dto';
import { ZonePermissionSeeder } from 'src/zone-table-management/seeders/zone-permissions.dto';


@Injectable()
export class MasterSeeder {
    constructor(
        private readonly accessRolePermissionSeeder: AccessRolePermissionSeeder,
        private readonly rolePermissionSeeder: RolePermissionSeeder,
        private readonly userPermissionSeeder: UserPermissionSeeder,
        private readonly permissionPermissionsSeeder: PermissionPermissionsSeeder,
        private readonly rolesSeeder: RolesSeeder,
        private readonly tablePermissionSeeder: TablePermissionSeeder,
        private readonly zonePermissionSeeder: ZonePermissionSeeder,
        private readonly clientPermissionSeeder: ClientPermissionSeeder
    ) { }

    async seedAll() {
        await this.rolesSeeder.seed();
        await this.rolePermissionSeeder.seed();
        await this.userPermissionSeeder.seed();
        await this.permissionPermissionsSeeder.seed();
        await this.accessRolePermissionSeeder.seed();
        await this.tablePermissionSeeder.seed();
        await this.zonePermissionSeeder.seed();
        await this.clientPermissionSeeder.seed();
        console.log('All seeders executed');
    }
}
