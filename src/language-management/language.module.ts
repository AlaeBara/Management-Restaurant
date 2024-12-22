import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Language } from './entities/language.entity';
import { LanguageSeeder } from './seeders/language.seeder';
import { LanguageService } from './services/langague.service';

@Module({
  imports: [TypeOrmModule.forFeature([Language])],
  controllers: [],
  providers: [LanguageSeeder, LanguageService],
  exports: [LanguageSeeder, LanguageService],
})
export class LanguageModule {}
