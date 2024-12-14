import { Supplier } from '../entities/supplier.entity';
import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Put, Query } from '@nestjs/common';
  import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateSupplierDto } from '../dto/create-supplier.dto';
import { SupplierService } from '../services/supplier.service';
import { Permissions } from 'src/user-management/decorators/auth.decorator';
import { UpdateSupplierDto } from '../dto/update-supplier.dto';

@Controller('api/suppliers')
@ApiTags('Suppliers')
@ApiBearerAuth()
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  /* private supplierPermissions = [
    { name: 'view-suppliers', label: 'Voir tous les fournisseurs', resource: 'supplier' },
    { name: 'create-supplier', label: 'Créer un nouveau fournisseur', resource: 'supplier' },
    { name: 'view-supplier', label: 'Voir un fournisseur spécifique', resource: 'supplier' },
    { name: 'update-supplier', label: 'Mettre à jour un fournisseur existant', resource: 'supplier' },
    { name: 'delete-supplier', label: 'Supprimer un fournisseur', resource: 'supplier' },
    { name: 'restore-supplier', label: 'Restaurer un fournisseur supprimé', resource: 'supplier' }
  ]; */


  @Get()
  @Permissions('view-suppliers')
  @ApiOperation({ summary: 'Get all suppliers' })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('relations') relations?: string[],
    @Query('sort') sort?: string,
    @Query('withDeleted') withDeleted?: boolean,
    @Query('onlyDeleted') onlyDeleted?: boolean,
    @Query('select') select?: string[],
    @Query() query?: any,
  ): Promise<{ data: Supplier[]; total: number; page: number; limit: number }> {
    return this.supplierService.findAll(
      page,
      limit,
      relations,
      sort,
      withDeleted,
      onlyDeleted,
      select,
      query
    );
  }

  @Post()
  @Permissions('create-supplier')
  @ApiOperation({ summary: 'Create a new supplier' })
  async createSupplier(@Body() createSupplierDto: CreateSupplierDto) {
    await this.supplierService.createSupplier(createSupplierDto);
    return { message: 'Super! Le fournisseur a été créé avec succès', status: 200 };
  }

  @Get(':id')
  @Permissions('view-supplier')
  @ApiOperation({ summary: 'Get a supplier by id' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('withDeleted') withDeleted?: boolean,
    @Query('relations') relations?: string[],
    @Query('onlyDeleted') onlyDeleted?: boolean,
    @Query('select') select?: string[],
    @Query('findOrThrow') findOrThrow?: boolean,
  ) {
    return this.supplierService.findOneByIdWithOptions(id, {
      relations,
      select,
      withDeleted,
      onlyDeleted,
      findOrThrow,
    });
  }

  @Put(':id')
  @Permissions('update-supplier')
  @ApiOperation({ summary: 'Update a supplier' })
  async updateSupplier(@Param('id', ParseUUIDPipe) id: string, @Body() updateSupplierDto: UpdateSupplierDto) {
    await this.supplierService.updateSupplier(id, updateSupplierDto);
    return { message: 'Super! Le fournisseur a été mis à jour avec succès', status: 200 };
  }

  @Delete(':id')
  @Permissions('delete-supplier')
  @ApiOperation({ summary: 'Delete a supplier' })
  async deleteSupplier(@Param('id', ParseUUIDPipe) id: string) {
    await this.supplierService.deleteSupplier(id);
    return { message: 'Super! Le fournisseur a été supprimé avec succès', status: 200 };
  }

  @Patch(':id/restore')
  @Permissions('delete-supplier')
  @ApiOperation({ summary: 'Restore a supplier' })
  async restoreSupplier(@Param('id', ParseUUIDPipe) id: string) {
    await this.supplierService.restoreSupplier(id);
    return { message: 'Super! Le fournisseur a été restauré avec succès', status: 200 };
  }     
}
