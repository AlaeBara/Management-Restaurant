import { ClientService } from '../services/client.service';
import {
  BadRequestException,
  Controller,
  Delete,
  Param,
  ParseUUIDPipe,
  Patch,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { createClientDto } from '../dto/create-client.dto';
import { Body, Get, Post } from '@nestjs/common';
import {
  Permissions,
  Public,
} from 'src/user-management/decorators/auth.decorator';
import { UpdateClientDto } from '../dto/update-client.dto';
import { LoginClientDto } from '../dto/login-client.dto';
import { Client } from '../entities/client.entity';

@Controller('api/clients')
@ApiTags('Client')
export class ClientController {
  constructor(private clientService: ClientService) {}

  /* private clientPermissions = [
    { name: 'view-clients', label: 'Voir tous les clients', resource: 'client' },
    { name: 'view-client', label: 'Voir un client spécifique', resource: 'client' },
    { name: 'create-client', label: 'Créer un nouveau client', resource: 'client' },
    { name: 'update-client', label: 'Mettre à jour un client existant', resource: 'client' },
    { name: 'delete-client', label: 'Supprimer un client', resource: 'client' },
    { name: 'restore-client', label: 'Restaurer un client supprimé', resource: 'client' }
  ]; */

  @Get()
  @Permissions('view-clients')
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('relations') relations?: string[],
    @Query('sort') sort?: string,
    @Query('withDeleted') withDeleted?: boolean,
    @Query('onlyDeleted') onlyDeleted?: boolean,
  ): Promise<{ data: Client[]; total: number; page: number; limit: number }> {
    return this.clientService.findAll(page, limit, relations, sort, withDeleted, onlyDeleted);
  }

  @Post('login')
  @Public()
  async loginClient(@Body() loginClientDto: LoginClientDto) {
    return await this.clientService.signin(loginClientDto);
  }

  @Post('register')
  @Public()
  async registerClient(@Body() createClientDto: createClientDto) {
    return await this.clientService.registerAndSignin(createClientDto);
  }

  @Post()
  @Permissions('create-client')
  async createClient(@Body() createClientDto: createClientDto) {
    return await this.clientService.createClientByAccess(createClientDto);
  }

  @Get(':id')
  @Permissions('view-client')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('relations') relations?: string[],
    @Query('withDeleted') withDeleted?: boolean,
  ) {
    return this.clientService.findOrThrowByUUID(id, relations, withDeleted);
  }

  @Put(':id')
  @Permissions('update-client')
  async updateClient(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() clientdto: UpdateClientDto,
  ) {
    return this.clientService.updateByUUID(id, clientdto);
  }

  @Delete(':id')
  @Permissions('delete-client')
  async deleteClient(@Param('id', ParseUUIDPipe) id: string) {
    const client = await this.clientService.findOrThrowByUUID(id);
    return this.clientService.deleteByEntity(client);
  }

  @Patch(':id/restore')
  @Permissions('restore-client')
  async restoreClient(@Param('id', ParseUUIDPipe) id: string) {
    await this.clientService.findOrThrowByUUID(id);
    return this.clientService.restoreByUUID(id, true, ['username', 'email']);
  }
}
