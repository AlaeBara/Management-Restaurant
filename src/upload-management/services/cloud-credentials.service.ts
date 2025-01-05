import { GenericService } from "src/common/services/generic.service";
import { Repository } from "typeorm";
import { CloudCredentials } from "../entities/cloud-credentials.entity";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { Injectable, Req, UnauthorizedException, BadRequestException } from "@nestjs/common";
import { CloudServices } from "../enums/cloud-services.enum";
import { CreateCloudCredentialsDto } from "../dtos/create-cloud-credentials.dto";
import { EncryptionService } from "src/encryption-management/services/encryption.service";
import { UserService } from "src/user-management/services/user/user.service";

@Injectable()
export class CloudCredentialsService extends GenericService<CloudCredentials> {
  constructor(
    @InjectDataSource() dataSource: DataSource,
    @InjectRepository(CloudCredentials)
    private cloudCredentialsRepository: Repository<CloudCredentials>,
    private encryptionService: EncryptionService,
    private userService: UserService
  ) {
    super(dataSource, CloudCredentials, 'Coordonnées de Cloud');
  }

  async fetchAll(request: Request) {
    const cloudCredentials = await this.cloudCredentialsRepository.find({
      where: { userOwner: { id: request['user'].sub } }
    });
    
    return await Promise.all(
      cloudCredentials.map(async credential => this.decryptCloudCredentials(credential))
    );
  }

  async createCloudCredentials(createCloudCredentialsDto: CreateCloudCredentialsDto, @Req() request: Request): Promise<CloudCredentials> {
    const found = await this.cloudCredentialsRepository.findOne({where: {userOwnerId: request['user'].sub , service: createCloudCredentialsDto.service}});
    if(found){
      throw new BadRequestException('Vous avez déjà des coordonnées de cloud pour ce service');
    }
    const cloudCredentials = await this.initCloudCredentials(createCloudCredentialsDto, request['user'].sub);
    await this.cloudCredentialsRepository.save(cloudCredentials);
    return cloudCredentials;
  }

  async initCloudCredentials(createCloudCredentialsDto: CreateCloudCredentialsDto, userId: string | number) {
    const cloudCredentials = this.cloudCredentialsRepository.create();
    cloudCredentials.service = createCloudCredentialsDto.service;
    cloudCredentials.AWS_ACCESS_KEY_ID = await this.encryptionService.encrypt(createCloudCredentialsDto.AWS_ACCESS_KEY_ID);
    cloudCredentials.AWS_SECRET_ACCESS_KEY = await this.encryptionService.encrypt(createCloudCredentialsDto.AWS_SECRET_ACCESS_KEY);
    cloudCredentials.AWS_REGION = await this.encryptionService.encrypt(createCloudCredentialsDto.AWS_REGION);
    cloudCredentials.AWS_BUCKET_NAME = await this.encryptionService.encrypt(createCloudCredentialsDto.AWS_BUCKET_NAME);
    cloudCredentials.CLOUDINARY_API_KEY = await this.encryptionService.encrypt(createCloudCredentialsDto.CLOUDINARY_API_KEY);
    cloudCredentials.CLOUDINARY_API_SECRET = await this.encryptionService.encrypt(createCloudCredentialsDto.CLOUDINARY_API_SECRET);
    cloudCredentials.CLOUDINARY_CLOUD_NAME = await  this.encryptionService.encrypt(createCloudCredentialsDto.CLOUDINARY_CLOUD_NAME);
    cloudCredentials.userOwner = await this.userService.findOneByIdWithOptions(userId);
    return cloudCredentials;
  }

  async getCloudCredentials(id: string | number, @Req() request: Request) {
    const cloudCredentials = await this.findOneByIdWithOptions(id);
    if (cloudCredentials.userOwnerId == request['user'].sub) {
      return await this.decryptCloudCredentials(cloudCredentials);
    } 
    return await this.maskCloudCredentials(cloudCredentials);
  }

  async decryptCloudCredentials(cloudCredentials: CloudCredentials) {
    return {
      ...cloudCredentials,
      AWS_ACCESS_KEY_ID:await this.encryptionService.decrypt(cloudCredentials.AWS_ACCESS_KEY_ID),
      AWS_SECRET_ACCESS_KEY: await this.encryptionService.decrypt(cloudCredentials.AWS_SECRET_ACCESS_KEY),
      AWS_REGION: await this.encryptionService.decrypt(cloudCredentials.AWS_REGION),
      AWS_BUCKET_NAME: await this.encryptionService.decrypt(cloudCredentials.AWS_BUCKET_NAME),
      CLOUDINARY_API_KEY: await this.encryptionService.decrypt(cloudCredentials.CLOUDINARY_API_KEY),
      CLOUDINARY_API_SECRET: await this.encryptionService.decrypt(cloudCredentials.CLOUDINARY_API_SECRET),
      CLOUDINARY_CLOUD_NAME: await this.encryptionService.decrypt(cloudCredentials.CLOUDINARY_CLOUD_NAME)
    }
  }

  async maskCloudCredentials(cloudCredentials: CloudCredentials) {

    return {
      ...cloudCredentials,
      AWS_ACCESS_KEY_ID: await this.encryptionService.maskData(cloudCredentials.AWS_ACCESS_KEY_ID),
      AWS_SECRET_ACCESS_KEY: await this.encryptionService.maskData(cloudCredentials.AWS_SECRET_ACCESS_KEY),
      AWS_REGION: await this.encryptionService.maskData(cloudCredentials.AWS_REGION),
      AWS_BUCKET_NAME: await this.encryptionService.maskData(cloudCredentials.AWS_BUCKET_NAME),
      CLOUDINARY_API_KEY: await this.encryptionService.maskData(cloudCredentials.CLOUDINARY_API_KEY),
      CLOUDINARY_API_SECRET: await this.encryptionService.maskData(cloudCredentials.CLOUDINARY_API_SECRET),
      CLOUDINARY_CLOUD_NAME: await this.encryptionService.maskData(cloudCredentials.CLOUDINARY_CLOUD_NAME)
    };
  }
}