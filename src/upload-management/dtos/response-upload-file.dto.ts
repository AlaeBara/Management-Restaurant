

export class ResponseUploadFileDto {
    success: boolean;
    filename: string;
    type: string;
    extension: string;
    filePath: string;
    size: number;
    uploadedAt: string;
    message?: string;
}
