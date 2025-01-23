
import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';

import { MenuItemTag } from '../entities/menu-item-tag.entity';

@Injectable()
export class TagSeeder {
    constructor(private readonly connection: Connection) { }

    async seed() {
        await this.seedMenuItemTags();
        console.log('MenuItem Tag Seeding completed!');
    }

    private async seedMenuItemTags() {

        const menuItemTags = [
            { tag: 'entrée', isProtected: true },
            { tag: 'plat principal', isProtected: true },
            { tag: 'dessert', isProtected: true },
        ];

        const menuItemTagRepository = this.connection.getRepository(MenuItemTag);

        for (const tagData of menuItemTags) {
            const existingTag = await menuItemTagRepository.findOne({
                where: { tag: tagData.tag },
                withDeleted: true
            });

            if (!existingTag) {
                await menuItemTagRepository.save(tagData);
            }
        }
    }
}
