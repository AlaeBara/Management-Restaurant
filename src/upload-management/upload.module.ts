import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadController } from './upload.controller';
import { FileUploadService } from './upload.service';
import { CloudinaryService } from './cloudinary.service';
import { Explore } from './explore.entity';
import { ImageService } from './db.service';
import { HostingerService } from './hostinger.service';
import { EncryptionModule } from 'src/encryption-management/encryption.module';
import { CloudCredentials } from './entities/cloud-credentials.entity';
import { MediaLibrary } from 'src/media-library-management/entities/media-library.entity';
import { MediaLibraryService } from 'src/media-library-management/services/media-library.service';
import { CloudCredentialsController } from './controllers/cloud-credentials.controller';
import { CloudCredentialsService } from './services/cloud-credentials.service';
import { UserManagementModule } from 'src/user-management/user-management.module';
import { LocalStorageService } from './storage/local-storage.service';


@Module({
    imports: [
        TypeOrmModule.forFeature([Explore, CloudCredentials]),
        forwardRef(() => EncryptionModule),
        TypeOrmModule.forFeature([MediaLibrary]),
        forwardRef(() => UserManagementModule)
    ],
    controllers: [CloudCredentialsController, UploadController],
    providers: [CloudCredentialsService, LocalStorageService,ImageService,HostingerService],
    exports: [CloudCredentialsService,LocalStorageService],
})
export class UploadModule { }
