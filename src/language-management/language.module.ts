import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Language } from './entities/language.entity';
import { LanguageService } from './services/langague.service';
import { LanguageController } from './controllers/language.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Language])],
  controllers: [LanguageController],
  providers: [LanguageService],
  exports: [LanguageService],
})

export class LanguageModule {}
