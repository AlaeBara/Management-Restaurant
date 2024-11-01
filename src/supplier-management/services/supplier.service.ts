import { GenericService } from 'src/common/services/generic.service';
import { Supplier } from '../entities/supplier.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CreateSupplierDto } from '../dto/create-supplier.dto';
import { SupplierStatus } from '../enums/status-supplier.enum';
import { ConflictException } from '@nestjs/common';
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
    return this.supplierRepository.save(createSupplierDto);
  }

  async deleteSupplier(id: string) {
    await this.findOneByIdWithOptions(id);
    const update = await this.update(id, { status: SupplierStatus.DELETED });
    if(update) return this.softDelete(id);
    throw new ConflictException('Problem while deleting supplier');
  }

  async restoreSupplier(id: string) {
    const supplier = await this.findOneByIdWithOptions(id, { onlyDeleted: true });
    let update = await this.update(supplier.id as any, { status: SupplierStatus.ACTIVE });
    update = null;
    if(update){
        return await this.restoreByUUID(id, true, ['name', 'phone', 'email','rcNumber','iceNumber']);
    }
    await this.update(supplier.id as any, { status: SupplierStatus.DELETED });
    throw new ConflictException('Problem while restoring supplier');
  }
}
