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
        await this.shiftZoneService.startShiftByWaiter(startShiftDTO, request);
        return { message: 'Super! Votre début de service a été enregistré avec succès', status: 200 };
    }

    @Post('end-shift-by-waiter')
    @Permissions('end-shift-by-waiter')
    @ApiOperation({ summary: 'End a shift for a waiter' })
    async endShiftByWaiter(@Body() endShiftDTO: EndShiftDTO, @Req() request: Request) {
        await this.shiftZoneService.endShiftByWaiter(endShiftDTO, request);
        return { message: 'Super! Votre fin de service a été enregistrée avec succès', status: 200 };
    }

    @Post('reassignment-shift-request-by-waiter')
    @Permissions('request-shift-reassignment-by-waiter')
    @ApiOperation({ summary: 'Request shift reassignment' })
    async requestReassignmentShift(
        @Body() reassignmentShiftDTO: ReassignmentShiftDTO,
        @Req() request: Request
    ) {
        await this.shiftZoneService.requestReassignmentShift(reassignmentShiftDTO, request);
        return { message: 'Super! Votre demande de reaffectation de service a été enregistrée avec succès', status: 200 };
    }

    @Post('response-reassignment-shift-request-by-waiter-or-responsable')
    @Permissions('response-reassignment-shift-request-by-waiter-or-responsable')
    @ApiOperation({ summary: 'Response to shift reassignment request' })
    async responseReassignmentRequest(
        @Body() responseReassignmentRequestDTO: ResponseReassignmentRequestDTO,
        @Req() request: Request
    ) {
        await this.shiftZoneService.repondReassignmentRequest(responseReassignmentRequestDTO, request);
        return { message: 'Super! Votre réponse à la demande de reaffectation de service a été enregistrée avec succès', status: 200 };
    }

}