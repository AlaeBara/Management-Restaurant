import { GenericService } from 'src/common/services/generic.service';
import { Supplier } from '../entities/supplier.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CreateSupplierDto } from '../dto/create-supplier.dto';
import { SupplierStatus } from '../enums/status-supplier.enum';
import { BadRequestException, ConflictException, forwardRef, Inject, Req } from '@nestjs/common';
import { UpdateSupplierDto } from '../dto/update-supplier.dto';
import { MediaLibraryService } from 'src/media-library-management/services/media-library.service';
import { PurchaseService } from 'src/purchase-management/services/purchase.service';
import { isEmpty } from 'class-validator';

export class SupplierService extends GenericService<Supplier> {
  constructor(
    @InjectDataSource() dataSource: DataSource,
    @InjectRepository(Supplier)
    private supplierRepository: Repository<Supplier>,
    private mediaLibraryService: MediaLibraryService,
    @Inject(forwardRef(() => PurchaseService))
    private purchaseService: PurchaseService
  ) {
    super(dataSource, Supplier, 'supplier');
  }

  async createSupplier(createSupplierDto: CreateSupplierDto, @Req() req: Request) {
    const supplier = await this.supplierRepository.create(createSupplierDto);

    await this.validateUnique({
      name: supplier.name,
      phone: supplier.phone,
      email: supplier.email,
      rcNumber: supplier.rcNumber,
      iceNumber: supplier.iceNumber,
    });

    supplier.logo = await this.mediaLibraryService.iniMediaLibrary(createSupplierDto.avatar, 'suppliers', req['user'].sub);
    return await this.supplierRepository.save(supplier);
  }

  async updateSupplier(id: string, updateSupplierDto: UpdateSupplierDto, @Req() req: Request) {
    console.log(updateSupplierDto);
    await this.validateUniqueExcludingSelf({
      name: updateSupplierDto.name,
      phone: updateSupplierDto.phone,
      email: updateSupplierDto.email,
      rcNumber: updateSupplierDto.rcNumber,
      iceNumber: updateSupplierDto.iceNumber,
    }, id);

    const supplier = await this.findOneByIdWithOptions(id, { relations: ['logo'] });
    if (updateSupplierDto.avatar) {
      if (supplier.logo) {
        const oldSupplier = supplier.logo;
        supplier.logo = await this.mediaLibraryService.iniMediaLibrary(updateSupplierDto.avatar, 'suppliers', req['user'].sub);
        // await this.mediaLibraryService.deleteMediaLibrary(oldSupplier.id);
      } else {
        supplier.logo = await this.mediaLibraryService.iniMediaLibrary(updateSupplierDto.avatar, 'suppliers', req['user'].sub);
      }
    }

    // Handle category_id


    Object.assign(supplier, updateSupplierDto);


    if ('avatar' in updateSupplierDto && isEmpty(updateSupplierDto.avatar)) {
      const mediaId = supplier.logo.id;
      supplier.logo = null;  // Set to null before saving
      await this.supplierRepository.save(supplier);  // Save first to remove the FK reference
      await this.mediaLibraryService.deleteMediaLibrary(mediaId);  // Then delete the media
    } else {
      await this.supplierRepository.save(supplier);
    }
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

  async getRemainingAmount(supplierId: string) {
    const purchases = await this.purchaseService.getPurchaseBySupplier(supplierId);

    const totalPaidAmount = purchases.reduce((acc, purchase) =>
      acc + Number(purchase.totalPaidAmount || 0), 0);
    const totalRemainingAmount = purchases.reduce((acc, purchase) =>
      acc + Number(purchase.totalRemainingAmount || 0), 0);

    const totalAmountTTC = purchases.reduce((acc, purchase) =>
      acc + Number(purchase.totalAmountTTC || 0), 0);
    return {
      totalPaidAmount,
      totalRemainingAmount,
      totalAmountTTC
    };
  }
}
