import { Module } from '@nestjs/common';
import QrcodeService from './services/qrcode.service';

@Module({
  imports: [],
  controllers: [],
  providers: [QrcodeService],
  exports: [QrcodeService],
})
export class qrCodeModule {}
