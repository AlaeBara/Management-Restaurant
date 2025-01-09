// src/upload/storage/local-storage.service.ts
import { BadRequestException, Injectable } from '@nestjs/common';
import { StorageService } from './storage.interface';
import * as fs from 'fs';
import * as path from 'path';
import { ResponseUploadFileDto } from '../dtos/response-upload-file.dto';
import { v4 as uuidv4 } from 'uuid';
import { MediaLibrary } from 'src/media-library-management/entities/media-library.entity';
@Injectable()
export class LocalStorageService implements StorageService {
   // private readonly uploadDir = path.join(__dirname, '..', '..', 'uploads');
    private readonly uploadDir = path.join(process.cwd(), 'uploads');
    private readonly validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'ico', 'webp','pdf'];
    private readonly maxFileSize = 5 * 1024 * 1024; // 5MB

    constructor() {
        if (!fs.existsSync(this.uploadDir)) {
            fs.mkdirSync(this.uploadDir, { recursive: true });
        }
    }

    private sanitizeFileName(fileName: string): string {
        return fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    }

    private validateFile(file: Express.Multer.File): void {
        if (file.size > this.maxFileSize) {
            throw new BadRequestException('File size exceeds limit');
        }

        const extension = file.mimetype.split('/')[1].toLowerCase();
        if (!this.validExtensions.includes(extension)) {
            throw new BadRequestException('Invalid file extension');
        }
    }

    async localUpload(file: Express.Multer.File, specificPath?: string): Promise<ResponseUploadFileDto> {
        try {
            this.validateFile(file);

            const sanitizedFileName = this.sanitizeFileName(file.originalname);
            const fileName = `${Date.now()}-${uuidv4()}-${sanitizedFileName}`;

            if (specificPath && /\.\./.test(specificPath)) {
                throw new BadRequestException('Invalid specificPath');
            }   

            const normalizedPath = specificPath
                ? path.normalize('/' + specificPath.replace(/^\/+/, ''))
                : '';

            const targetDir = path.join(this.uploadDir, normalizedPath);

            if (!(await fs.promises.access(targetDir).catch(() => false))) {
                await fs.promises.mkdir(targetDir, { recursive: true });
            }

            const absolutePath = path.join(targetDir, fileName);

            // Ensure the final path is within uploadDir (prevent path traversal)
            if (!absolutePath.startsWith(this.uploadDir)) {
                throw new BadRequestException('Invalid upload path');
            }

            await fs.promises.writeFile(absolutePath, file.buffer);

            return {
                success: true,
                filename: fileName,
                type: file.mimetype,
                extension: '.' + file.mimetype.split('/')[1].toLowerCase(),
                filePath: path.join('/local', normalizedPath, fileName).replace(/\\/g, '/'),
                size: file.size,
                uploadedAt: new Date().toISOString(),
            } as ResponseUploadFileDto;

        } catch (error) {
            return {
                success: false,
                message: error.message
            } as ResponseUploadFileDto;
        }
    }

    async upload(file: Express.Multer.File): Promise<string> {
        const fileName = `${Date.now()}-${file.originalname}`;
        const filePath = path.join(this.uploadDir, fileName);
        fs.writeFileSync(filePath, file.buffer);
        return filePath;
    }

    async delete(filePath: string): Promise<void> {
        // Remove the '/local' prefix and convert to proper path
        const relativePath = filePath.replace(/^\/local\//, '');
        const absolutePath = path.join(this.uploadDir, relativePath);
        
        // Check if file exists before attempting to delete
        if (!fs.existsSync(absolutePath)) {
            throw new BadRequestException(`File not found: ${filePath}`);
        }
        
        // Ensure the final path is within uploadDir (prevent path traversal)
        if (!absolutePath.startsWith(this.uploadDir)) {
            throw new BadRequestException('Invalid delete path');
        }
    
        await fs.promises.unlink(absolutePath);
    }
}