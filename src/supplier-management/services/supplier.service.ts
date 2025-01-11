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

  async inizializeQueryRunner() {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    return queryRunner;
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
    const queryRunner = await this.inizializeQueryRunner();
    // Start a new transaction
    try {
      await this.validateUniqueExcludingSelf({
        name: updateSupplierDto.name,
        phone: updateSupplierDto.phone,
        email: updateSupplierDto.email,
        rcNumber: updateSupplierDto.rcNumber,
        iceNumber: updateSupplierDto.iceNumber,
      }, id);
   
      const supplier = await queryRunner.manager.findOne(Supplier, {
        where: { id },
        relations: ['logo']
      });
    
      if (updateSupplierDto.avatar && !updateSupplierDto.setAvatarAsNull) {
        if (supplier.logo) {
          await this.mediaLibraryService.deleteMediaLibrary(supplier.logo.id, queryRunner);
        }
        supplier.logo = await this.mediaLibraryService.iniMediaLibrary(updateSupplierDto.avatar, 'suppliers', req['user'].sub);
      }

      if (updateSupplierDto.setAvatarAsNull && updateSupplierDto.setAvatarAsNull) {
        if(supplier.logo) await this.mediaLibraryService.deleteMediaLibrary(supplier.logo.id, queryRunner);
        supplier.logo = null;
      }
      
      Object.assign(supplier, updateSupplierDto);

      await queryRunner.manager.save(Supplier, supplier);
      await queryRunner.commitTransaction();
      return supplier;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(error.message);
    } finally {
      await queryRunner.release();
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
