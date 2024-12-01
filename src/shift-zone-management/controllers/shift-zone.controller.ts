import { Body, Controller, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Permissions, Public } from "src/user-management/decorators/auth.decorator";
import { ShiftZoneService } from "../services/shift-zone.service";
import { CreateStartShiftDTO } from "../dtos/create-start-Shift.dto";
import { MailerService } from "@nestjs-modules/mailer";
import { CreateEndShiftDTO } from "../dtos/create-end-shift.dto";

@Controller('api/shift-zone')
@ApiTags('Shift Zone Management')
@ApiBearerAuth()
export class ShiftZoneController {

    constructor(private readonly shiftZoneService: ShiftZoneService, private readonly mailService: MailerService) { }

    @Post('/start-shift-by-waiter')
    @Permissions('start-shift-by-waiter')
    @ApiOperation({ summary: 'Create a category' })
    async startShift(@Body() createStartShift: CreateStartShiftDTO) {
        await this.shiftZoneService.startShiftByWaiter(createStartShift);
        return { message: 'Great! Shift has been CREATED successfully', status: 201 };
    }

    @Post('/end-shift-by-waiter')
    @Permissions('end-shift-by-waiter')
    @ApiOperation({ summary: 'Create a category' })
    async endShift(@Body() createEndShift: CreateEndShiftDTO) {
        await this.shiftZoneService.endShiftByWaiter(createEndShift);
        return { message: 'Great! Shift has been CREATED successfully', status: 201 };
    }

}