// src/database/seeder.service.ts
import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { Permission } from '../../user-management/entities/permission.entity';
import { LanguageOptions } from '../enums/languages.enum';
import { Language } from '../entities/language.entity';

@Injectable()
export class LanguageSeeder {
  constructor(private readonly connection: Connection) { }

  async seed() {
    await this.seedLanguages();
    console.log('Language Seeding completed!');
  }

  private async seedLanguages() {



    const languageRepository = this.connection.getRepository(Language);

    for (const languageData of LanguageOptions) {
      const existingLanguage = await languageRepository.findOne({
        where: { value: languageData.value },
        withDeleted: true
      });

      if (!existingLanguage) {
        await languageRepository.save(languageData);
      }
    }
  }
}
