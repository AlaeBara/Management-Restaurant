import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadController } from './upload.controller';
import { ImageService } from './db.service';
import { HostingerService } from './hostinger.service';
import { EncryptionModule } from 'src/encryption-management/encryption.module';
import { CloudCredentials } from './entities/cloud-credentials.entity';
import { MediaLibrary } from 'src/media-library-management/entities/media-library.entity';
import { CloudCredentialsController } from './controllers/cloud-credentials.controller';
import { CloudCredentialsService } from './services/cloud-credentials.service';
import { UserManagementModule } from 'src/user-management/user-management.module';
import { LocalStorageService } from './storage/local-storage.service';


@Module({
    imports: [
        TypeOrmModule.forFeature([CloudCredentials]),
        forwardRef(() => EncryptionModule),
        TypeOrmModule.forFeature([MediaLibrary]),
        forwardRef(() => UserManagementModule)
    ],
    controllers: [CloudCredentialsController, UploadController],
    providers: [CloudCredentialsService, LocalStorageService],
    exports: [CloudCredentialsService,LocalStorageService],
})
export class UploadModule { }
