import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Put, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Permissions } from "src/user-management/decorators/auth.decorator";
import { ChoiceAttributeService } from "../services/choice/choice-attribute.service";
import { ChoiceAttribute } from "../entities/choices/choice-attribute.entity";
import { CreateChoiceAttributeDto } from "../dtos/choices/create-choice-attribute.dto";
import { UpdateChoiceAttributeDto } from "../dtos/choices/update-choice-attribute.dto";
import { ParseULIDPipe } from "src/common/pipes/parse-ulid.pipe";


@Controller('api/choice-attributes')
@ApiTags('choice-attribute')
@ApiBearerAuth()
export class ChoiceAttributeController {

    constructor(
        @Inject()
        private readonly choiceAttributeService: ChoiceAttributeService
    ) {}

    @Get()
    @Permissions('view-choice-attributes')
    @ApiOperation({ summary: 'Get all choice attributes' })
    async findAll(
        @Query('page') page?: number,
        @Query('limit') limit?: number,
        @Query('relations') relations?: string[],
        @Query('sort') sort?: string,
        @Query('withDeleted') withDeleted?: boolean,
        @Query('onlyDeleted') onlyDeleted?: boolean,
        @Query('select') select?: string[],
        @Query() query?: any,
    ): Promise<{ data: ChoiceAttribute[]; total: number; page: number; limit: number }> {
        return this.choiceAttributeService.findAll(
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

    @Get(':id')
    @Permissions('view-choice-attributes')
    @ApiOperation({ summary: 'Get a choice attribute by id' })
    async findOne(
        @Param('id', ParseULIDPipe) id: string,
        @Query('withDeleted') withDeleted?: boolean,
        @Query('relations') relations?: string[],
        @Query('onlyDeleted') onlyDeleted?: boolean,
        @Query('select') select?: string[],
        @Query('findOrThrow') findOrThrow?: boolean,
    ): Promise<ChoiceAttribute> {
        return this.choiceAttributeService.findOneWithoutBuilder(id, {
            relations,
            select,
            withDeleted,
            onlyDeleted,
            findOrThrow,
        });
    }

    @Post()
    @Permissions('create-choice-attribute')
    @ApiOperation({ summary: 'Create a choice attribute' })
    async create(@Body() createChoiceAttributeDto: CreateChoiceAttributeDto) {
        await this.choiceAttributeService.createAttribute(createChoiceAttributeDto);
        return { message: 'Super! Votre nouvel attribut a été créé avec succès', status: 201 };
    }

    @Put(':id')
    @Permissions('update-choice-attribute')
    @ApiOperation({ summary: 'Update a choice attribute' })
    async update(
        @Param('id', ParseULIDPipe) id: string,
        @Body() updateChoiceAttributeDto: UpdateChoiceAttributeDto,
    ) {
        await this.choiceAttributeService.updateChoiceAttribute(id, updateChoiceAttributeDto);
        return { message: 'Super! Votre attribut a été modifié avec succès', status: 200 };
    }

    @Delete(':id')
    @Permissions('delete-choice-attribute')
    @ApiOperation({ summary: 'Delete a choice attribute' })
    async delete(@Param('id', ParseULIDPipe) id: string) {
        await this.choiceAttributeService.softDelete(id, true);
        return { message: 'Super! Votre attribut a été supprimé avec succès', status: 200 };
    }

    @Patch(':id/restore')
    @Permissions('restore-choice-attribute')
    @ApiOperation({ summary: 'Restore a choice attribute' })
    async restore(@Param('id', ParseULIDPipe) id: string) {
        await this.choiceAttributeService.restoreByUUID(id, true, ['attribute']);
        return { message: 'Super! Votre attribut a été restauré avec succès', status: 200 };
    }
}
