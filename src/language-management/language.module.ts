import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Language } from './entities/language.entity';
import { LanguageSeeder } from './seeders/language.seeder';

@Module({
  imports: [TypeOrmModule.forFeature([Language])],
  controllers: [],
  providers: [LanguageSeeder],
  exports: [LanguageSeeder],
})
export class LanguageModule {}
