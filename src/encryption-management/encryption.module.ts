import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EncryptionService } from './services/encryption.service';

@Module({
  imports: [TypeOrmModule.forFeature([]),],
  controllers: [],
  providers: [EncryptionService],
  exports: [EncryptionService],
})
export class EncryptionModule {}

