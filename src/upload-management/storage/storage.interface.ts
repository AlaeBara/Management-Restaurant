// src/upload/storage/storage.interface.ts
export interface StorageService {
    upload(file: Express.Multer.File): Promise<string>;
    delete(filePath: string): Promise<void>;
}