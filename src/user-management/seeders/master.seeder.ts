// src/database/seeder.service.ts
import { Injectable } from '@nestjs/common';
import { AccessRolePermissionSeeder } from './access-role-permission.seeder';
import { RolePermissionSeeder } from './role-permission.seeder';
import { UserPermissionSeeder } from './user-permission.seeder';
import { PermissionPermissionsSeeder } from './permission-permissions.seeder';
import { RolesSeeder } from './role.seeder';

@Injectable()
export class MasterSeeder {
    constructor(
        private readonly accessRolePermissionSeeder: AccessRolePermissionSeeder,
        private readonly rolePermissionSeeder: RolePermissionSeeder,
        private readonly userPermissionSeeder: UserPermissionSeeder,
        private readonly permissionPermissionsSeeder: PermissionPermissionsSeeder,
        private readonly rolesSeeder: RolesSeeder
    ) { }

    async seedAll() {
        await this.rolesSeeder.seed();
        await this.rolePermissionSeeder.seed();
        await this.userPermissionSeeder.seed();
        await this.permissionPermissionsSeeder.seed();
        await this.accessRolePermissionSeeder.seed();
        console.log('All seeders executed');
    }
}
