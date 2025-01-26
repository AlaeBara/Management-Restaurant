import {
    Body,
    Controller,
    Delete, Get, Patch, Post, Put,
    Inject,
    Param,
    Query,
} from "@nestjs/common";
import {
    ApiBearerAuth,
    ApiOperation,
    ApiTags
} from "@nestjs/swagger";

import { Permissions } from "src/user-management/decorators/auth.decorator";
import { ParseULIDPipe } from "src/common/pipes/parse-ulid.pipe";
import { Guest } from "../entities/guest.entity";
import { CreateGuestDto } from "../dtos/guest/create-guest.dto";
import { UpdateGuestDto } from "../dtos/guest/update-guest.dto";
import { GuestService } from "../services/guest.service";

@Controller('api/guests')
@ApiTags('guests')
@ApiBearerAuth()
export class GuestController {

    constructor(
        @Inject(GuestService)
        private readonly guestService: GuestService
    ) { }

    @Get()
    @Permissions('view-guests')
    @ApiOperation({ summary: 'Get all guests' })
    async findAll(
        @Query('page') page?: number,
        @Query('limit') limit?: number,
        @Query('relations') relations?: string[],
        @Query('sort') sort?: string,
        @Query('withDeleted') withDeleted?: boolean,
        @Query('onlyDeleted') onlyDeleted?: boolean,
        @Query('select') select?: string[],
        @Query() query?: any,
    ): Promise<{ data: Guest[]; total: number; page: number; limit: number }> {
        return this.guestService.findAll(
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

    @Get(':id')
    @Permissions('view-guests')
    @ApiOperation({ summary: 'Get a guest by id' })
    async findOne(
        @Param('id', ParseULIDPipe) id: string,
        @Query('withDeleted') withDeleted?: boolean,
        @Query('relations') relations?: string[],
        @Query('onlyDeleted') onlyDeleted?: boolean,
        @Query('select') select?: string[],
        @Query('findOrThrow') findOrThrow?: boolean,
    ): Promise<Guest> {
        return this.guestService.findOneWithoutBuilder(id, {
            relations,
            select,
            withDeleted,
            onlyDeleted,
            findOrThrow,
        });
    }

    @Post()
    @Permissions('create-guest')
    @ApiOperation({ summary: 'Create a guest' })
    async create(@Body() createGuestDto: CreateGuestDto) {
        const guest = await this.guestService.getOrCreateGuest(createGuestDto);

        return { message: 'Super! Votre guest a été créé avec succès', status: 201, data: guest };
    }

    @Put(':id')
    @Permissions('update-guest')
    @ApiOperation({ summary: 'Update a guest' })
    async update(@Param('id', ParseULIDPipe) id: string, @Body() updateGuestDto: UpdateGuestDto) {
        const guest = await this.guestService.updateGuest(id, updateGuestDto);

        return { message: 'Super! Votre guest a été modifié avec succès', status: 200, data: guest };
    }

    @Delete(':id')
    @Permissions('delete-guest')
    @ApiOperation({ summary: 'Delete a guest' })
    async delete(@Param('id', ParseULIDPipe) id: string) {
        await this.guestService.deleteGuest(id);

        return { message: 'Super! Votre guest a été supprimé avec succès', status: 200 };
    }

    @Patch(':id/restore')
    @Permissions('restore-guest')
    @ApiOperation({ summary: 'Restore a guest' })
    async restore(@Param('id', ParseULIDPipe) id: string) {
        await this.guestService.restoreByUUID(id, true, ['guest']);

        return { message: 'Super! Votre guest a été restauré avec succès', status: 200 };
    }
}
