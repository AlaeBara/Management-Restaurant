// src/database/seeder.service.ts
import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { Permission } from '../entity/permission.entity';
import { Role } from '../entity/role.entity';
import { User } from '../entity/user.entity';
import { hash } from 'argon2';
import { Gender } from '../enums/gender.enum';
import { UserStatus } from '../enums/user-status.enum';

@Injectable()
export class AccessRolePermissionSeeder {
    constructor(private readonly connection: Connection) { }

    async seed() {
        await this.seedUsers();
        console.log('Access Role Permission Seeding completed!');
    }

    private async seedUsers() {
        const roleRepository = this.connection.getRepository(Role);
        const permissionRepository = this.connection.getRepository(Permission);
        let superadmin: Role;
        superadmin = await roleRepository.findOne({ where: { name: 'superadmin' }, withDeleted: true });
        const accessGranted = await permissionRepository.findOne({ where: { name: 'access-granted' } });
        if (!accessGranted) {
            permissionRepository.save({ name: 'access-granted', label: 'Accès accordé', resource: 'full-access' });
        }
        if (!superadmin) {
            superadmin = await roleRepository.save({ name: 'superadmin', label: 'Accès et contrôle complet du système' });
        }
        superadmin.permissions = [accessGranted];
        await roleRepository.save(superadmin);

        const userRepository = this.connection.getRepository(User);
        const superadminUser = await userRepository.findOne({ where: [{ email: process.env.SUPERADMIN_EMAIL }, { username: 'superadmin' }], withDeleted: true });

        if (!superadminUser) {
            const user = [{
                firstname: 'Ayoub',
                lastname: 'Baraoui',
                email: process.env.SUPERADMIN_EMAIL,
                isEmailVerified: true,
                status: UserStatus.ACTIVE,
                username: 'superadmin',
                password: await hash(process.env.SUPERADMIN_PASSWORD),
                gender: Gender.MALE
            }];
            await userRepository.save(user);
            const createdSuperAdmin = await userRepository.findOne({ where: [{ email: process.env.SUPERADMIN_EMAIL }, { username: 'superadmin' }], withDeleted: true });
            createdSuperAdmin.roles = [superadmin];
            await userRepository.save(createdSuperAdmin);
        }


    }
}