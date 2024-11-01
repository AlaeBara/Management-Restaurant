import { GenericService } from 'src/common/services/generic.service';
import { Client } from '../entities/client.entity';
import { DataSource, EntityManager, IsNull, Not, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { createClientDto } from '../dto/create-client.dto';
import { hash, verify } from 'argon2';
import { RoleService } from 'src/user-management/services/role/role.service';
import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginClientDto } from '../dto/login-client.dto';
import { statusClient } from '../enums/client.enum';

@Injectable()
export class ClientService extends GenericService<Client> {
  constructor(
    @InjectDataSource()
    private datasource: DataSource,
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    @Inject(forwardRef(() => RoleService))
    private roleRepository: RoleService,
    private jwtService: JwtService,
  ) {
    super(datasource, Client, 'client');
  }

  async signin(loginClientDto: LoginClientDto): Promise<{ token: string }> {
    const client = await this.findClientByEmailOrUsername(
      loginClientDto.emailOrUsername,
    );

    if (!client) {
      throw new UnauthorizedException(
        'Account not found. Please sign up to create an account.',
      );
    }

    const isPasswordValid = await verify(
      client.password,
      loginClientDto.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credentials are incorrect');
    }

    const token = await this.generateToken(client);
    await this.updateLastLogin(client, this.datasource.manager);

    return { token };
  }

  async registerAndSignin(
    clientdto: createClientDto,
  ): Promise<{ token: string }> {
    const queryRunner = this.datasource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      // Create client within transaction
      await this.createClient(clientdto, queryRunner.manager);

      // Get fresh client with all relations using the same transaction manager
      const client = await this.getClientWithRelationsUsingManager(
        clientdto.username,
        queryRunner.manager,
        ['role', 'role.permissions'],
      );

      if (!client) {
        throw new Error('Client not found after creation');
      }

      const token = await this.generateToken(client);
      await this.updateLastLogin(client, queryRunner.manager);
      await queryRunner.commitTransaction();

      return { token };
    } catch (error) {
      if (queryRunner.isTransactionActive) {
        await queryRunner.rollbackTransaction();
      }
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private async findClientByEmailOrUsername(
    emailOrUsername: string,
  ): Promise<Client> {
    const client = await this.clientRepository.findOne({
      where: [{ email: emailOrUsername }, { username: emailOrUsername }],
      select: {
        id: true,
        email: true,
        username: true,
        password: true,
        status: true,
        isEmailVerified: true,
      },
      relations: {
        role: {
          permissions: true,
        },
      },
    });

    if (!client) {
      throw new NotFoundException('credentials are invalid');
    }
    return client;
  }

  private async getClientWithRelationsUsingManager(
    username: string,
    manager: EntityManager,
    relations?: string[],
  ): Promise<Client> {
    const client = await manager.findOne(Client, {
      where: { username },
      relations: relations,
    });

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    return client;
  }

  async createClient(clientdto: createClientDto, manager: EntityManager) {
    await this.throwIfFoundByAnyAttribute({
      username: clientdto.username,
      email: clientdto.email,
    });
    clientdto.password = await hash(clientdto.password);
    const role = await this.roleRepository.findOrThrowByAttribute({
      name: 'client',
    });
    const user = manager.create(Client, {
      ...clientdto,
      role,
    });

    await manager.save(user);
  }

  async createClientByAccess(clientdto: createClientDto) {
    await this.throwIfFoundByAnyAttribute({
      username: clientdto.username,
      email: clientdto.email,
    });
    clientdto.password = await hash(clientdto.password);
    const role = await this.roleRepository.findOrThrowByAttribute({
      name: 'client',
    });
    const user = this.clientRepository.create({
      ...clientdto,
      role,
    });

    await this.clientRepository.save(user);
  }

  async generateToken(client: Client) {
    const payload = {
      sub: client.id,
      username: client.username,
      email: client.email,
      role: client.role.name,
      roles: [client.role.name],
      permissions: client.role.permissions.map((perm) => perm.name),
    };
    return this.jwtService.sign(payload);
  }

  async updateLastLogin(client: Client, manager: EntityManager) {
    client.lastLogin = new Date();
    await manager.save(client);
  }

  async deleteClient(id: string) {
    const client = await this.findOrThrowByUUID(id);
    client.status = statusClient.DELETED;
    await this.clientRepository.save(client);
    await this.softDelete(id);
  }

  async restoreClient(id: string) {
    const client = await this.findOrThrowByUUID(id, undefined, true);
    client.status = statusClient.ACTIVE;
    await this.clientRepository.save(client);
    await this.restoreByUUID(id, true, ['username', 'email']);
  }
}
