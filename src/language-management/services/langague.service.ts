import { Injectable } from "@nestjs/common";
import { GenericService } from "src/common/services/generic.service";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { Language } from "../entities/language.entity";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class LanguageService extends GenericService<Language> {
    constructor(
        @InjectDataSource() dataSource: DataSource,
        @InjectRepository(Language)
        readonly languageRepository: Repository<Language>,
    ) {
        super(dataSource, Language, 'language');
    }

    async getLanguageByCode(code: string) {
        return this.findOneByIdWithOptions(code);
    }
}