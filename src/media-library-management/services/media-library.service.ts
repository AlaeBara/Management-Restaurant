import { InjectRepository } from "@nestjs/typeorm";

import { InjectDataSource } from "@nestjs/typeorm";
import { MediaLibrary } from "../entities/media-library.entity";
import { Repository } from "typeorm";
import { GenericService } from "src/common/services/generic.service";
import { DataSource } from "typeorm";
import { ResponseUploadFileDto } from "src/upload-management/dtos/response-upload-file.dto";
import { User } from "src/user-management/entities/user.entity";
import { UserService } from "src/user-management/services/user/user.service";
import { LocalStorageService } from "src/upload-management/storage/local-storage.service";
import { forwardRef, Inject } from "@nestjs/common";

export class MediaLibraryService extends GenericService<MediaLibrary> {
  constructor(
    @InjectDataSource() dataSource: DataSource,
    @InjectRepository(MediaLibrary)
    private mediaLibraryRepository: Repository<MediaLibrary>,
    @Inject(forwardRef(() => LocalStorageService))
    private readonly uploadService: LocalStorageService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {
    super(dataSource, MediaLibrary, 'média');
  }

  async saveMediaLibrary(metadata: ResponseUploadFileDto, uploadedBy?: User): Promise<MediaLibrary> {
    const mediaLibrary = new MediaLibrary();
    mediaLibrary.localPath = metadata.filePath;
    mediaLibrary.fileName = metadata.filename;
    mediaLibrary.fileType = metadata.type;
    mediaLibrary.fileSize = metadata.size;
    mediaLibrary.fileExtension = metadata.extension;
    if (uploadedBy) mediaLibrary.uploadedBy = uploadedBy;
    return await this.mediaLibraryRepository.save(mediaLibrary);
  }

  async iniMediaLibrary(file: Express.Multer.File, path: string, userId: string) {
    const metadata = await this.uploadService.localUpload(file, path);
    const user = await this.userService.findOne(userId);
    return await this.saveMediaLibrary(metadata, user);
  }

  async deleteMediaLibrary(mediaLibraryId: string) {
    const mediaLibrary = await this.findOneByIdWithOptions(mediaLibraryId);
    await this.mediaLibraryRepository.delete(mediaLibraryId);
    return await this.uploadService.delete(mediaLibrary.localPath);
  }
}