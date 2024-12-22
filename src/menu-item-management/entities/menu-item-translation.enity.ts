import { BaseEntity } from "src/common/entities/base.entity";
import { AfterLoad, Column, Entity, ManyToOne, RelationId } from "typeorm";
import { MenuItem } from "./menu-item.entity";
import { Language } from "src/language-management/entities/language.entity";

@Entity(`${process.env.DATASET_PREFIX || ''}item_menu_translate`)
export class MenuItemTranslate extends BaseEntity {

    @ManyToOne(() => MenuItem, (menuItem) => menuItem.translates, { eager: false })
    menuItem: MenuItem;

    @ManyToOne(() => Language, (language) => language.id,   {eager:true})
    language: Language;

    languageValue: string;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'varchar', length: 255 })
    description: string;

    @AfterLoad()
    setLanguageValue() {
        this.languageValue = this.language.value;
        delete this.language;
    }
}