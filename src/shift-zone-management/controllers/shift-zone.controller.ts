import { Body, Controller, Post, Req, Request } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Permissions, Public } from "src/user-management/decorators/auth.decorator";
import { ShiftZoneService } from "../services/shift-zone.service";
import { StartShiftDTO } from "../dtos/start-Shift.dto";
import { MailerService } from "@nestjs-modules/mailer";
import { EndShiftDTO } from "../dtos/end-shift.dto";
import { ReassignmentShiftDTO } from "../dtos/reassignment-shift.dto";
import { ResponseReassignmentRequestDTO } from "../dtos/response-reassignment-request.dto";

@Controller('api/shift-zone')
@ApiTags('Shift Zone Management')
@ApiBearerAuth()
export class ShiftZoneController {

    constructor(private readonly shiftZoneService: ShiftZoneService) { }


    /* const permission = [
        { name: 'start-shift', label: 'Start a shift for a waiter', resource: 'shift-zone' },
        { name: 'end-shift', label: 'End a shift for a waiter', resource: 'shift-zone' },
        { name: 'request-shift-reassignment', label: 'Request shift reassignment', resource: 'shift-zone' }
        { name: 'response-reassignment-shift-request-by-waiter-or-responsable', label: 'Response to shift reassignment request', resource: 'shift-zone' }
    ]; */


    @Post('start-shift-by-waiter')
    @Permissions('start-shift-by-waiter')
    @ApiOperation({ summary: 'Start a shift for a waiter' })
    async startShiftByWaiter(@Body() startShiftDTO: StartShiftDTO, @Req() request: Request) {
        return this.shiftZoneService.startShiftByWaiter(startShiftDTO, request);
    }

    @Post('end-shift-by-waiter')
    @Permissions('end-shift-by-waiter')
    @ApiOperation({ summary: 'End a shift for a waiter' })
    async endShiftByWaiter(@Body() endShiftDTO: EndShiftDTO, @Req() request: Request) {
        return this.shiftZoneService.endShiftByWaiter(endShiftDTO, request);
    }

    @Post('reassignment-shift-request-by-waiter')
    @Permissions('request-shift-reassignment-by-waiter')
    @ApiOperation({ summary: 'Request shift reassignment' })
    async requestReassignmentShift(
        @Body() reassignmentShiftDTO: ReassignmentShiftDTO,
        @Req() request: Request
    ) {
        return this.shiftZoneService.requestReassignmentShift(reassignmentShiftDTO, request);
    }

    @Post('response-reassignment-shift-request-by-waiter-or-responsable')
    @Permissions('response-reassignment-shift-request-by-waiter-or-responsable')
    @ApiOperation({ summary: 'Response to shift reassignment request' })
    async responseReassignmentRequest(
        @Body() responseReassignmentRequestDTO: ResponseReassignmentRequestDTO,
        @Req() request: Request
    ) {
        return this.shiftZoneService.repondReassignmentRequest(responseReassignmentRequestDTO, request);
    }

}