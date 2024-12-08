import * as QRCode from 'qrcode';

export default class QrcodeService {
  async generateQrCode(data: string): Promise<string> {
    const qrCodeDataURL = await QRCode.toDataURL(data, {
      width: 300,
      margin: 2,
      errorCorrectionLevel: 'H',
    });
    return qrCodeDataURL;
  }
}
