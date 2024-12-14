import { BadRequestException, forwardRef, Inject, Injectable, Req } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { ShiftZone } from "../entities/shift-zone.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { GenericService } from "src/common/services/generic.service";
import { DataSource, Repository } from "typeorm";
import { StartShiftDTO } from "../dtos/start-Shift.dto";
import { UserService } from "src/user-management/services/user/user.service";
import { ShiftZoneActionType } from "../enums/shift-zone.enum";
import { ZoneService } from "src/zone-table-management/services/zone.service";
import { ZoneStatus } from "src/zone-table-management/enums/zone-status.enum";
import { EndShiftDTO } from "../dtos/end-shift.dto";
import { ReassignmentShiftDTO } from "../dtos/reassignment-shift.dto";
import { ShiftReassignmentRequest } from "../entities/shift-reassignment-request.entity";
import { RequestShiftStatus } from "../enums/request-shift.enum";
import { ResponseReassignmentRequestDTO } from "../dtos/response-reassignment-request.dto";
import { REDIRECT_METADATA } from "@nestjs/common/constants";
import { User } from "src/user-management/entities/user.entity";
import { Zone } from "src/zone-table-management/entities/zone.entity";

@Injectable()
export class ShiftZoneService extends GenericService<ShiftZone> {

    constructor(
        @InjectDataSource() dataSource: DataSource,
        @InjectRepository(ShiftZone)
        private readonly shiftZoneRepository: Repository<ShiftZone>,
        @InjectRepository(ShiftReassignmentRequest)
        private readonly shiftReassignmentRequestRepository: Repository<ShiftReassignmentRequest>,
        @Inject(forwardRef(() => UserService))
        private readonly userService: UserService,
        @Inject(forwardRef(() => ZoneService))
        private readonly zoneService: ZoneService,
    ) {
        super(dataSource, ShiftZone, 'shift_zone');
    }

    /**
     * Initializes a shift in a zone for a waiter.
     * @param waiter - The waiter assigned to the shift.
     * @param zone - The zone where the shift is being initialized.
     * @param actionType - The type of action (e.g., START, REASSIGN, END).
     * @param auditingUser - The user performing the action.
     * @param requestReassignment - Optional reassignment request related to the shift.
     * @returns The saved ShiftZone entity.
     */
    async initializeShift(waiter: User, zone: Zone, actionType: ShiftZoneActionType, auditingUser: User, requestReassignment?: ShiftReassignmentRequest): Promise<ShiftZone> {
        const Shift = this.shiftZoneRepository.create();
        Shift.waiter = waiter;
        Shift.auditingUser = auditingUser;
        Shift.zone = zone;
        Shift.actionType = actionType;
        Shift.reassignmentRequest = requestReassignment ? requestReassignment : null;
        return await this.shiftZoneRepository.save(Shift);
    }

    /**
     * Creates a shift reassignment request for a zone.
     * @param shift - The current active shift in the zone.
     * @param requestedWaiter - The waiter being requested for the reassignment.
     */
    async initializeReassignmentShiftRequest(shift: ShiftZone, requestedWaiter: User) {
        const requestToAssign = this.shiftReassignmentRequestRepository.create()
        requestToAssign.currentWaiter = shift.waiter;
        requestToAssign.requestedWaiter = requestedWaiter;
        requestToAssign.zone = shift.zone;
        await this.shiftReassignmentRequestRepository.save(requestToAssign);
    }

    /**
     * Resolves a shift reassignment request.
     * @param status - The status of the request (e.g., ACCEPTED, REJECTED).
     * @param requestReassignment - The shift reassignment request to be resolved.
     * @param rejectionReason - Optional reason for rejection.
     */
    async resolveReassignmentRequest(status: RequestShiftStatus, requestReassignment: ShiftReassignmentRequest, rejectionReason?: string) {
        requestReassignment.status = status;
        requestReassignment.resolvedAt = new Date();
        if (status == RequestShiftStatus.REJECTED && !rejectionReason) throw new BadRequestException('Le motif de rejet est requis.')
        requestReassignment.rejectionReason = rejectionReason ? rejectionReason : null;
        await this.shiftReassignmentRequestRepository.save(requestReassignment);
    }

    /**
     * Updates the status and current waiter of a zone.
     * @param zone - The zone to be updated.
     * @param status - The new status of the zone.
     * @param newWaiter - Optional new waiter assigned to the zone.
     */
    async updateZoneStatus(zone: Zone, status: ZoneStatus, newWaiter?: User) {
        zone.status = status;
        zone.currentWaiter = newWaiter ? newWaiter : null;
        await this.zoneService.zoneRepository.save(zone);
    }

    /**
     * Starts a shift for a waiter in a zone.
     * @param createStartShift - The data for starting the shift.
     * @param request - The request object containing user information.
     * @returns The saved ShiftZone entity.
     */
    async startShiftByWaiter(createStartShift: StartShiftDTO, @Req() request: Request): Promise<ShiftZone> {
        const lastShift = await this.shiftZoneRepository.findOne({
            where: { zone: { id: createStartShift.zoneId } },
            order: { createdAt: 'DESC' }
        });

        if (lastShift && [ShiftZoneActionType.START, ShiftZoneActionType.REASSIGN].includes(lastShift.actionType)) {
            throw new BadRequestException('La zone a déjà un début de service actif. Veuillez terminer le service actuel avant de commencer un nouveau.')
        }

        //  const waiter = await this.userService.findOneByIdWithOptions(createStartShift.waiterId);
        const waiter = await this.userService.findOneByIdWithOptions(request['user'].sub);
        const zone = await this.zoneService.findOneByIdWithOptions(createStartShift.zoneId)

        const shift = await this.initializeShift(waiter, zone, ShiftZoneActionType.START, waiter);
        await this.updateZoneStatus(zone, ZoneStatus.ASSIGNED, waiter);

        return shift;
    }

    /**
     * Ends a shift for a waiter in a zone.
     * @param createEndShift - The data for ending the shift.
     * @param request - The request object containing user information.
     */
    async endShiftByWaiter(createEndShift: EndShiftDTO, @Req() request: Request) {
        const lastShift = await this.shiftZoneRepository.findOne({
            where: { zone: { id: createEndShift.zoneId } },
            order: { createdAt: 'DESC' },
            relations: ['zone', 'waiter']
        });

        if (!lastShift || ![ShiftZoneActionType.START, ShiftZoneActionType.REASSIGN].includes(lastShift.actionType)) {
            throw new BadRequestException('Le serveur n\'a pas de début de service actif à terminer.')
        }

        const waiterId = request['user'].sub;
        if (lastShift.waiter.id != waiterId) {
            throw new BadRequestException('Vous n\'êtes pas autorisé à terminer ce service.');
        }

        await this.initializeShift(lastShift.waiter, lastShift.zone, ShiftZoneActionType.END, lastShift.auditingUser, null);
        await this.updateZoneStatus(lastShift.zone, ZoneStatus.AVAILABLE, null);
        return;
    }

    /**
     * Requests a shift reassignment for a zone.
     * @param reassignment - The data for requesting the reassignment.
     * @param request - The request object containing user information.
     */
    async requestReassignmentShift(reassignment: ReassignmentShiftDTO, @Req() request: Request) {
        const zone = await this.zoneService.findOneByIdWithOptions(reassignment.zoneId)

        if (zone.status == ZoneStatus.AVAILABLE) {
            throw new BadRequestException('Ne peut demander une reaffectation pour une zone disponible. La zone doit être assignée à un serveur.')
        }

        const shift = await this.shiftZoneRepository.findOne({
            where: { zone: { id: reassignment.zoneId } },
            order: { createdAt: 'DESC' },
            relations: ['zone', 'waiter']
        });

        const countOpenRequest = await this.shiftReassignmentRequestRepository.count(
            {
                where: {
                    zone: { id: reassignment.zoneId },
                    status: RequestShiftStatus.PENDING
                },
                withDeleted: false
            }
        )

        if (countOpenRequest > 0) {
            throw new BadRequestException('Il existe déjà une demande de reaffectation en attente pour cette zone.')
        }

        if (![ShiftZoneActionType.REASSIGN, ShiftZoneActionType.START].includes(shift.actionType)) {
            throw new BadRequestException('Ne peut reaffecter un service déjà terminé.')
        }

        const requestedWaiter = await this.userService.findOneByIdWithOptions(request['user'].sub);

        if (requestedWaiter.id == shift.waiter.id) {
            throw new BadRequestException('Ne peut demander une reaffectation à vous-même.')
        }

        await this.initializeReassignmentShiftRequest(shift, requestedWaiter);
    }

    /**
     * Responds to a shift reassignment request.
     * @param responseReassignmentRequestDTO - The data for responding to the reassignment request.
     * @param request - The request object containing user information.
     */
    async repondReassignmentRequest(responseReassignmentRequestDTO: ResponseReassignmentRequestDTO, @Req() request: Request) {
        const requestReassignment = await this.shiftReassignmentRequestRepository.findOne(
            {
                where: {
                    id: responseReassignmentRequestDTO.ReassignmentRequesId,
                },
                withDeleted: false,
                relations: ['zone', 'currentWaiter', 'requestedWaiter']
            }
        )
        if (!requestReassignment) {
            throw new BadRequestException('Demande de reaffectation non trouvée.')
        }

        if ([RequestShiftStatus.ACCEPTED, RequestShiftStatus.REJECTED].includes(requestReassignment.status)) {
            throw new BadRequestException('Cette demande de reaffectation a déjà été traitée.')
        }

        const auditingUser = await this.userService.findOneByIdWithOptions(request['user'].sub)

        switch (responseReassignmentRequestDTO.status) {
            case RequestShiftStatus.ACCEPTED:
                await this.resolveReassignmentRequest(RequestShiftStatus.ACCEPTED, requestReassignment);
                break;
            case RequestShiftStatus.REJECTED:
                await this.resolveReassignmentRequest(RequestShiftStatus.REJECTED, requestReassignment, responseReassignmentRequestDTO.rejectionReason);
                return;
        }

        await this.initializeShift(requestReassignment.requestedWaiter, requestReassignment.zone, ShiftZoneActionType.REASSIGN, auditingUser, requestReassignment);
        const zone = await this.zoneService.findOneByIdWithOptions(requestReassignment.zone.id)
        await this.updateZoneStatus(zone, ZoneStatus.ASSIGNED, requestReassignment.requestedWaiter);
    }
}