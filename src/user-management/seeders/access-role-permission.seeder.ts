// src/database/seeder.service.ts
import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { Permission } from '../entities/permission.entity';
import { Role } from '../entities/role.entity';
import { User } from '../entities/user.entity';
import { hash } from 'argon2';
import { Gender } from '../../common/enums/gender.enum';
import { UserStatus } from '../enums/user-status.enum';

@Injectable()
export class AccessRolePermissionSeeder {
    constructor(private readonly connection: Connection) { }

    async seed() {
        await this.seedSuperadmin();
        console.log('Superadmin Seeding completed!');
    }

    private async seedSuperadmin() {
        const roleRepository = this.connection.getRepository(Role);
        const permissionRepository = this.connection.getRepository(Permission);
        const userRepository = this.connection.getRepository(User);
    
        // Ensure the permission exists
        let accessGranted = await permissionRepository.findOne({ where: { name: 'access-granted' } });
        if (!accessGranted) {
            accessGranted = await permissionRepository.save({
                name: 'access-granted',
                label: 'Accès accordé',
                resource: 'full-access',
            });
        }
    
        // Ensure the role exists
        let superadminRole = await roleRepository.findOne({
            where: { name: 'superadmin' },
            relations: ['permissions'], // Include relations to avoid overwriting
        });
    
        if (!superadminRole) {
            superadminRole = roleRepository.create({
                name: 'superadmin',
                label: 'Accès et contrôle complet du système',
                permissions: [accessGranted],
            });
            superadminRole = await roleRepository.save(superadminRole);
        } else if (!superadminRole.permissions.some(p => p.name === 'access-granted')) {
            superadminRole.permissions.push(accessGranted);
            await roleRepository.save(superadminRole);
        }
    
        // Ensure the user exists
        let superadminUser = await userRepository.findOne({
            where: [
                { email: process.env.SUPERADMIN_EMAIL },
                { username: 'superadmin' },
            ],
            relations: ['roles', 'roles.permissions'],
        });
    
        if (!superadminUser) {
            superadminUser = userRepository.create({
                firstname: 'Ayoub',
                lastname: 'Baraoui',
                email: process.env.SUPERADMIN_EMAIL,
                isEmailVerified: true,
                status: UserStatus.ACTIVE,
                username: 'superadmin',
                password: await hash(process.env.SUPERADMIN_PASSWORD),
                gender: Gender.MALE,
                roles: [superadminRole],
            });
            superadminUser = await userRepository.save(superadminUser);
        } else if (!superadminUser.roles.some(role => role.name === 'superadmin')) {
            superadminUser.roles.push(superadminRole);
            await userRepository.save(superadminUser);
        }
    }
    
}