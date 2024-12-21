import { DataSource, Repository } from "typeorm";
import { MenuItemTag } from "../entities/menu-item-tag.entity";
import { GenericService } from "src/common/services/generic.service";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { BadRequestException, Injectable } from "@nestjs/common";
import { MenuItem } from "../entities/menu-item.entity";

@Injectable()
export class MenuItemService extends GenericService<MenuItem> {
    constructor(
        @InjectDataSource() dataSource: DataSource,
        @InjectRepository(MenuItem)
        readonly menuItemRepository: Repository<MenuItem>,

    ) {
        super(dataSource, MenuItem, 'article menu');
    }

}