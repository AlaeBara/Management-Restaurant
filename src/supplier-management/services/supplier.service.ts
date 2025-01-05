import { GenericService } from 'src/common/services/generic.service';
import { Supplier } from '../entities/supplier.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CreateSupplierDto } from '../dto/create-supplier.dto';
import { SupplierStatus } from '../enums/status-supplier.enum';
import { ConflictException, Req } from '@nestjs/common';
import { UpdateSupplierDto } from '../dto/update-supplier.dto';
import { MediaLibraryService } from 'src/media-library-management/services/media-library.service';

export class SupplierService extends GenericService<Supplier> {
  constructor(
    @InjectDataSource() dataSource: DataSource,
    @InjectRepository(Supplier)
    private supplierRepository: Repository<Supplier>,
    private mediaLibraryService: MediaLibraryService
  ) {
    super(dataSource, Supplier, 'supplier');
  }

  async createSupplier(createSupplierDto: CreateSupplierDto,file:Express.Multer.File,@Req() req:Request) {
    const supplier = await this.supplierRepository.create(createSupplierDto);
    
    await this.validateUnique({
      name: supplier.name,
      phone: supplier.phone,
      email: supplier.email,
      rcNumber: supplier.rcNumber,
      iceNumber: supplier.iceNumber,
    });

    supplier.logo = await this.mediaLibraryService.iniMediaLibrary(file,'suppliers',req['user'].sub);
    return await this.supplierRepository.save(supplier);
  }

  async updateSupplier(id: string, updateSupplierDto: UpdateSupplierDto) {
    await this.validateUniqueExcludingSelf({
      name: updateSupplierDto.name,
      phone: updateSupplierDto.phone,
      email: updateSupplierDto.email,
      rcNumber: updateSupplierDto.rcNumber,
      iceNumber: updateSupplierDto.iceNumber,
    }, id);
    await this.supplierRepository.update(id, updateSupplierDto);
  }

  async deleteSupplier(id: string) {
    const supplier = await this.findOneByIdWithOptions(id, { select: 'status' });
    try {
      const statusUpdate = await this.update(id, { status: SupplierStatus.DELETED });
      if (!statusUpdate.affected) {
        throw new ConflictException('Problème lors de la mise à jour du statut du fournisseur');
      }
      return await this.softDelete(id);
    } catch (error) {
      await this.update(id, { status: supplier.status });
      throw new ConflictException('Problème lors de la suppression du fournisseur:' + error.message);

    }
  }

  async restoreSupplier(id: string) {
    const supplier = await this.findOneByIdWithOptions(id, { onlyDeleted: true });
    try {
      const statusUpdate = await this.update(supplier.id, { status: SupplierStatus.ACTIVE });
      if (statusUpdate.affected === 0) {
        throw new ConflictException('Problème lors de la mise à jour du statut du fournisseur');
      }
      return await this.restoreByUUID(id, true, ['name', 'phone', 'email', 'rcNumber', 'iceNumber']);
    } catch (error) {
      await this.update(supplier.id, { status: SupplierStatus.DELETED });
      throw new ConflictException('Problème lors de la restauration du fournisseur:' + error.message);
    }
  }
}
