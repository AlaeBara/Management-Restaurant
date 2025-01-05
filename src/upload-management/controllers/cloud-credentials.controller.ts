import { Body, Controller, Post, Req, Get, Param } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { CloudCredentialsService } from "../services/cloud-credentials.service";
import { CreateCloudCredentialsDto } from "../dtos/create-cloud-credentials.dto";
import { Permissions } from "src/user-management/decorators/auth.decorator";

@ApiTags('cloud-credentials')
@Controller('api/cloud-credentials')
export class CloudCredentialsController {
    constructor(
        private cloudCredentialsService: CloudCredentialsService,
    ) { }

    @Post()
    @Permissions('create-cloud-credentials')
    @ApiOperation({ summary: 'Create cloud credentials' })
    async createCloudCredentials(@Body() createCloudCredentialsDto: CreateCloudCredentialsDto,@Req() req: Request) {
        return this.cloudCredentialsService.createCloudCredentials(createCloudCredentialsDto,req);
    }

    @Get(':id')
    @Permissions('view-cloud-credentials')
    @ApiOperation({ summary: 'Get cloud credentials' })
    async getCloudCredentials(@Param('id') id: string, @Req() req: Request) {
        return this.cloudCredentialsService.getCloudCredentials(id, req);
    }

    @Get()
    @Permissions('view-cloud-credentials')
    @ApiOperation({ summary: 'Get all cloud credentials' })
    async fetchAllCloudCredentials(@Req() req: Request) {
        return this.cloudCredentialsService.fetchAll(req);
    }
}