/* // src/upload/storage/cloud-storage.service.ts
import { Injectable } from '@nestjs/common';
import { StorageService } from './storage.interface';
import * as AWS from 'aws-sdk';
import { CloudCredentialsService } from '../services/cloud-credentials.service';


@Injectable()
export class CloudStorageService implements StorageService {
  private s3: AWS.S3;

  constructor(private cloudCredentialsService: CloudCredentialsService) {
  }

  async initialize(service: string): Promise<void> {
    const credentials = await this.cloudCredentialsService.getCloudCredentials(service,{} as any);
    if (!credentials) {
      throw new Error('Cloud credentials not found');
    }

    this.s3 = new AWS.S3({
      accessKeyId: credentials.AWS_ACCESS_KEY_ID,
      secretAccessKey: credentials.AWS_SECRET_ACCESS_KEY,
      region: credentials.AWS_REGION,
    });
  }

  async upload(file: Express.Multer.File): Promise<string> {
    const params = {
      Bucket: this.s3.AWS_BUCKET_NAME,
      Key: `${Date.now()}-${file.originalname}`,
      Body: file.buffer,
    };

    const result = await this.s3.upload(params).promise();
    return result.Location; // Returns the file URL
  }

  async delete(filePath: string): Promise<void> {
    const params = {
      Bucket: this.s3.AWS_BUCKET_NAME,
      Key: filePath,
    };

    await this.s3.deleteObject(params).promise();
  }
} */