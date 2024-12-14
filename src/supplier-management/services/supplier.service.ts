import { GenericService } from 'src/common/services/generic.service';
import { Supplier } from '../entities/supplier.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CreateSupplierDto } from '../dto/create-supplier.dto';
import { SupplierStatus } from '../enums/status-supplier.enum';
import { ConflictException } from '@nestjs/common';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';
export class SupplierService extends GenericService<Supplier> {
  constructor(
    @InjectDataSource() dataSource: DataSource,
    @InjectRepository(Supplier)
    private supplierRepository: Repository<Supplier>,
  ) {
    super(dataSource, Supplier, 'supplier');
  }

  async createSupplier(createSupplierDto: CreateSupplierDto) {
    await this.validateUnique({
      name: createSupplierDto.name,
      phone: createSupplierDto.phone,
      email: createSupplierDto.email,
      rcNumber: createSupplierDto.rcNumber,
      iceNumber: createSupplierDto.iceNumber,
    });
    await this.supplierRepository.save(createSupplierDto);
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
