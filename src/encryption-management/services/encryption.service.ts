import * as CryptoJS from 'crypto-js';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EncryptionService {
 
    private readonly encryptionKey = process.env.ENCRYPTION_KEY; // Set this in your .env file

    async encrypt(data: string): Promise<string> {
      return CryptoJS.AES.encrypt(data, this.encryptionKey).toString();
    }
  
    async decrypt(encryptedData: string): Promise<string> {
      const bytes = CryptoJS.AES.decrypt(encryptedData, this.encryptionKey);
      return bytes.toString(CryptoJS.enc.Utf8);
    }

    async maskData(toMask: string): Promise<string> {
        const maskMiddle = (text: string) => {
          if (!text) return '';
    
          let visibleChars: number;
          if (text.length < 10) {
            visibleChars = 2;
          } else if (text.length < 15) {
            visibleChars = 3;
          } else {
            visibleChars = 4;
          }
    
          return `${text.slice(0, visibleChars)}${'*'.repeat(text.length - (visibleChars * 2))}${text.slice(-visibleChars)}`;
        };
    
        const decryptAndMask = async (value: string) => {
          const decrypted = await this.decrypt(value);
          return maskMiddle(decrypted);
        };
        return await decryptAndMask(toMask);
    }
}
