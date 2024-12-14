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
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { createClientDto } from '../dto/create-client.dto';
import { Body, Get, Post } from '@nestjs/common';
import {
  Permissions,
  Public,
} from 'src/user-management/decorators/auth.decorator';
import { UpdateClientDto } from '../dto/update-client.dto';
import { LoginClientDto } from '../dto/login-client.dto';
import { Client } from '../entities/client.entity';
import { statusClient } from '../enums/client.enum';

@Controller('api/clients')
@ApiTags('Client')
@ApiBearerAuth()
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
  @ApiOperation({ summary: 'Get all clients' }) 
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('relations') relations?: string[],
    @Query('sort') sort?: string,
    @Query('withDeleted') withDeleted?: boolean,
    @Query('onlyDeleted') onlyDeleted?: boolean,
    @Query('select') select?: string[],
    @Query() query?: any,
  ): Promise<{ data: Client[]; total: number; page: number; limit: number }> {
    return this.clientService.findAll(
      page,
      limit,
      relations,
      sort,
      withDeleted,
      onlyDeleted,
      select,
      query,
    );
  }

  @Post('login')
  @Public()
  @ApiOperation({ summary: 'Login a client' })
  async loginClient(@Body() loginClientDto: LoginClientDto) {
    const token = await this.clientService.signin(loginClientDto);
    return { message: 'Connexion réussie', status: 200, token };
  }

  @Post('register')
  @Public()
  @ApiOperation({ summary: 'Register a client' })
  async registerClient(@Body() createClientDto: createClientDto) {
    await this.clientService.registerAndSignin(createClientDto);
    return { message: 'Super! Le compte client a été créé avec succès', status: 201 };
  }

  @Post()
  @Permissions('create-client')
  @ApiOperation({ summary: 'Create a client' })
  async createClient(@Body() createClientDto: createClientDto) {
    await this.clientService.createClientByAccess(createClientDto);
    return { message: 'Super! Le compte client a été créé avec succès', status: 201 };
  }

  @Get(':id')
  @Permissions('view-client')
  @ApiOperation({ summary: 'Get a client by id' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('relations') relations?: string[],
    @Query('withDeleted') withDeleted?: boolean,
  ) {
    return this.clientService.findOrThrowByUUID(id, relations, withDeleted);
  }

  @Put(':id')
  @Permissions('update-client')
  @ApiOperation({ summary: 'Update a client' })
  async updateClient(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() clientdto: UpdateClientDto,
  ) {
    await this.clientService.update(id, clientdto);
    return { message: 'Super! Votre client a été modifié avec succès', status: 200 };
  }

  @Delete(':id')
  @Permissions('delete-client')
  @ApiOperation({ summary: 'Delete a client' })
  async deleteClient(@Param('id', ParseUUIDPipe) id: string, @Req() request: Request) {
    await this.clientService.deleteClient(id, request);
    return { message: 'Super! Votre client a été supprimé avec succès', status: 200 };
  }

  @Patch(':id/restore')
  @Permissions('restore-client')
  @ApiOperation({ summary: 'Restore a client' })
  async restoreClient(@Param('id', ParseUUIDPipe) id: string) {
    await this.clientService.restoreClient(id);
    return { message: 'Super! Votre client a été restauré avec succès', status: 200 };
  }
}
