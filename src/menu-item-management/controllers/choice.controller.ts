import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Put, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Permissions } from "src/user-management/decorators/auth.decorator";
import { ParseULIDPipe } from "src/common/pipes/parse-ulid.pipe";
import { ChoiceService } from "../services/choice/choice.service";
import { Choice } from "../entities/choices/choice.entity";
import { CreateChoiceDto } from "../dtos/choices/create-choice.dto";
import { UpdateChoiceDto } from "../dtos/choices/update-choice.dto";
import { CreateBatchChoiceDto } from "../dtos/choices/create-batch-choice.dto";
import { CreateAttributeWithChoicesDto } from "../dtos/choices/create-attribute-choices.dto";
import { ChoiceAttributeService } from "../services/choice/choice-attribute.service";
import { UpdateAttributeWithChoicesDto } from "../dtos/choices/update-attribute-choices.dto";

@Controller('api/choices')
@ApiTags('choice')
@ApiBearerAuth()
export class ChoiceController {

    constructor(
        @Inject(ChoiceService)
        private readonly choiceService: ChoiceService,
        @Inject(ChoiceAttributeService)
        private readonly choiceAttributeService: ChoiceAttributeService,
    ) {}


    @Get()
    @Permissions('view-choices')
    @ApiOperation({ summary: 'Get all choices' })
    async findAll(
        @Query('page') page?: number,
        @Query('limit') limit?: number,
        @Query('relations') relations?: string[],
        @Query('sort') sort?: string,
        @Query('withDeleted') withDeleted?: boolean,
        @Query('onlyDeleted') onlyDeleted?: boolean,
        @Query('select') select?: string[],
        @Query() query?: any,
    ): Promise<{ data: Choice[]; total: number; page: number; limit: number }> {
        return this.choiceService.findAll(
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
    @Permissions('view-choices')
    @ApiOperation({ summary: 'Get a choice by id' })
    async findOne(
        @Param('id', ParseULIDPipe) id: string,
        @Query('withDeleted') withDeleted?: boolean,
        @Query('relations') relations?: string[],
        @Query('onlyDeleted') onlyDeleted?: boolean,
        @Query('select') select?: string[],
        @Query('findOrThrow') findOrThrow?: boolean,
    ): Promise<Choice> {
        return this.choiceService.findOneWithoutBuilder(id, {
            relations,
            select,
            withDeleted,
            onlyDeleted,
            findOrThrow,
        });
    }

    @Post()
    @Permissions('create-choice')
    @ApiOperation({ summary: 'Create a choice' })
    async create(@Body() createChoiceDto: CreateChoiceDto) {
        await this.choiceService.createChoice(createChoiceDto);
        return { message: 'Super! Votre nouvel choix a été créé avec succès', status: 201 };
    }

    @Post('batch/:attributeId')
    @Permissions('create-choice')
    @ApiOperation({ summary: 'Create a batch of choices' })
    async createBatch(@Param('attributeId', ParseULIDPipe) attributeId: string, @Body() createBatchChoiceDto: CreateBatchChoiceDto) {
        const choiceAttribute = await this.choiceAttributeService.findOneByIdWithOptions(attributeId);
        await this.choiceService.createBatch(choiceAttribute, createBatchChoiceDto);
        return { message: 'Super! Votre ensemble de choix a été créé avec succès', status: 201 };

    }

    @Put(':id')
    @Permissions('update-choice')
    @ApiOperation({ summary: 'Update a choice' })
    async update(
        @Param('id', ParseULIDPipe) id: string,
        @Body() updateChoiceDto: UpdateChoiceDto,
    ) {
        await this.choiceService.updateChoice(id, updateChoiceDto);
        return { message: 'Super! Votre choix a été modifié avec succès', status: 200 };
    }

    @Delete(':id')
    @Permissions('delete-choice')
    @ApiOperation({ summary: 'Delete a choice' })
    async delete(@Param('id', ParseULIDPipe) id: string) {
        await this.choiceService.softDelete(id, true);
        return { message: 'Super! Votre choix a été supprimé avec succès', status: 200 };
    }

    @Patch(':id/restore')
    @Permissions('restore-choice')
    @ApiOperation({ summary: 'Restore a choice' })
    async restore(@Param('id', ParseULIDPipe) id: string) {
        await this.choiceService.restoreByUUID(id, true, ['attribute']);
        return { message: 'Super! Votre choix a été restauré avec succès', status: 200 };
    }

    @Post('attributes')
    @Permissions('create-choice')
    @ApiOperation({ summary: 'Create an attribute with choices' })
    async createAttributeWithChoices(@Body() createAttributeWithChoicesDto: CreateAttributeWithChoicesDto) {
        await this.choiceService.createAttributeWithChoices(createAttributeWithChoicesDto);
        return { message: 'Super! Votre attribut avec ses choix a été créé avec succès', status: 201 };
    }

    @Put('attributes/:id')
    @Permissions('update-choice')
    @ApiOperation({ summary: 'Update an attribute with choices' })
    async updateAttributeWithChoices(@Param('id', ParseULIDPipe) id: string, @Body() updateAttributeWithChoicesDto: UpdateAttributeWithChoicesDto) {
        await this.choiceService.updateAttributeWithChoices(id, updateAttributeWithChoicesDto);
        return { message: 'Super! Votre attribut avec ses choix a été modifié avec succès', status: 200 };
    }
}
