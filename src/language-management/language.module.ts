import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Language } from './entities/language.entity';
import { LanguageSeeder } from './seeders/language.seeder';
import { LanguageService } from './services/langague.service';
import { LanguageController } from './controllers/language.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Language])],
  controllers: [LanguageController],
  providers: [LanguageSeeder, LanguageService],
  exports: [LanguageSeeder, LanguageService],
})
export class LanguageModule {}
