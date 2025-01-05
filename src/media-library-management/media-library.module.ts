import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaLibraryService } from './services/media-library.service';
import { MediaLibrary } from './entities/media-library.entity';
import { MediaLibraryController } from './controllers/media-library.controller';
import { UserManagementModule } from 'src/user-management/user-management.module';
import { UploadModule } from 'src/upload-management/upload.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MediaLibrary]),
    forwardRef(() => UploadModule),
    forwardRef(() => UserManagementModule)
  ],
  controllers: [MediaLibraryController],
  providers: [MediaLibraryService],
  exports: [MediaLibraryService],
})
export class MediaLibraryModule { }

