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

    async startShiftByWaiter(createStartShift: StartShiftDTO, @Req() request: Request): Promise<ShiftZone> {
        const lastShift = await this.shiftZoneRepository.findOne({
            where: { zone: { id: createStartShift.zoneId } },
            order: { createdAt: 'DESC' }
        });

        if (lastShift && [ShiftZoneActionType.START, ShiftZoneActionType.REASSIGN].includes(lastShift.actionType)) {
            throw new BadRequestException('Zone already has an active shift. Please end current shift before starting a new one.')
        }


        //  const waiter = await this.userService.findOneByIdWithOptions(createStartShift.waiterId);
        const waiter = await this.userService.findOneByIdWithOptions(request['user'].sub);
        const zone = await this.zoneService.findOneByIdWithOptions(createStartShift.zoneId)

        const shift = await this.initializeShift(waiter, zone, ShiftZoneActionType.START, waiter);

        zone.currentWaiter = waiter;
        zone.status = ZoneStatus.ASSIGNED;
        await this.zoneService.zoneRepository.save(zone);

        return shift;
    }

    async initializeShift(waiter: User, zone: Zone, actionType: ShiftZoneActionType, auditingUser: User, requestReassignment?: ShiftReassignmentRequest): Promise<ShiftZone> {
        const Shift = this.shiftZoneRepository.create();
        Shift.waiter = waiter;
        Shift.auditingUser = auditingUser;
        Shift.zone = zone;
        Shift.actionType = actionType;
        Shift.reassignmentRequest = requestReassignment ? requestReassignment : null;
        return await this.shiftZoneRepository.save(Shift);
    }

    async endShiftByWaiter(createEndShift: EndShiftDTO, @Req() request: Request) {
        const lastShift = await this.shiftZoneRepository.findOne({
            where: { zone: { id: createEndShift.zoneId } },
            order: { createdAt: 'DESC' },
            relations: ['zone', 'waiter']
        });

        if (!lastShift || ![ShiftZoneActionType.START, ShiftZoneActionType.REASSIGN].includes(lastShift.actionType)) {
            throw new BadRequestException('Waiter does not have an active shift to end.')
        }

        const waiterId = request['user'].sub;
        if (lastShift.waiter.id != waiterId) {
            throw new BadRequestException('You are not authorized to end this shift.');
        }

        await this.initializeShift(lastShift.waiter, lastShift.zone, ShiftZoneActionType.END, lastShift.auditingUser, null);


        lastShift.zone.status = ZoneStatus.AVAILABLE;
        lastShift.zone.currentWaiter = null;
        await this.zoneService.zoneRepository.save(lastShift.zone);
        return;
    }

    async requestReassignmentShift(reassignment: ReassignmentShiftDTO, @Req() request: Request) {
        const zone = await this.zoneService.findOneByIdWithOptions(reassignment.zoneId)

        if (zone.status == ZoneStatus.AVAILABLE) {
            throw new BadRequestException('Cannot request reassignment for an available zone. Zone must be assigned to a waiter.')
        }


        const shift = await this.shiftZoneRepository.findOne({
            where: { zone: { id: reassignment.zoneId } },
            order: { createdAt: 'DESC' },
            relations: ['zone', 'waiter']
        });

        console.log(shift)

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
            throw new BadRequestException('There is already a pending reassignment request for this zone.')
        }

        if (![ShiftZoneActionType.REASSIGN, ShiftZoneActionType.START].includes(shift.actionType)) {
            throw new BadRequestException('Cannot reassign an already ended shift.')
        }
        const requestedWaiterId = request['user'].sub;

        const requestedWaiter = await this.userService.findOneByIdWithOptions(requestedWaiterId);

        if (requestedWaiter.id == shift.waiter.id) {
            throw new BadRequestException('Cannot request reassignment to yourself.')
        }

        const requestToAssign = this.shiftReassignmentRequestRepository.create()
        requestToAssign.currentWaiter = shift.waiter;
        requestToAssign.requestedWaiter = requestedWaiter;
        requestToAssign.zone = shift.zone;
        requestToAssign.status
        await this.shiftReassignmentRequestRepository.save(requestToAssign);
    }

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
            throw new BadRequestException('Reassignment request not found.')
        }

        if ([RequestShiftStatus.ACCEPTED, RequestShiftStatus.REJECTED].includes(requestReassignment.status)) {
            throw new BadRequestException('This reassignment request has already been processed.')
        }

        const auditingUserId = request['user'].sub
        const auditingUser = await this.userService.findOneByIdWithOptions(auditingUserId)

        switch (responseReassignmentRequestDTO.status) {
            case RequestShiftStatus.ACCEPTED:
                requestReassignment.status = RequestShiftStatus.ACCEPTED;
                requestReassignment.approvedBy = auditingUser;
                requestReassignment.resolvedAt = new Date();
                await this.shiftReassignmentRequestRepository.save(requestReassignment);
                break;
            case RequestShiftStatus.REJECTED:
                if (!responseReassignmentRequestDTO.rejectionReason) throw new BadRequestException('Rejection reason is required.')
                requestReassignment.status = RequestShiftStatus.REJECTED;
                requestReassignment.rejectionReason = responseReassignmentRequestDTO.rejectionReason;
                requestReassignment.resolvedAt = new Date();
                await this.shiftReassignmentRequestRepository.save(requestReassignment);
                return;
        }

        await this.initializeShift(requestReassignment.requestedWaiter, requestReassignment.zone, ShiftZoneActionType.REASSIGN, auditingUser, requestReassignment);

        const zone = await this.zoneService.findOneByIdWithOptions(requestReassignment.zone.id)

        zone.status = ZoneStatus.ASSIGNED;
        zone.currentWaiter = requestReassignment.requestedWaiter;
        await this.zoneService.zoneRepository.save(zone);
    }
}