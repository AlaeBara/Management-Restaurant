import { BadRequestException, forwardRef, Inject, Injectable, Req } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { ShiftZone } from "../entities/shift-zone.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { GenericService } from "src/common/services/generic.service";
import { DataSource, Repository } from "typeorm";
import { CreateStartShiftDTO } from "../dtos/create-start-Shift.dto";
import { UserService } from "src/user-management/services/user/user.service";
import { ShiftZoneActionType } from "../enums/shift-zone.enum";
import { ZoneService } from "src/zone-table-management/services/zone.service";
import { ZoneStatus } from "src/zone-table-management/enums/zone-status.enum";
import { CreateEndShiftDTO } from "../dtos/create-end-shift.dto";

@Injectable()
export class ShiftZoneService extends GenericService<ShiftZone> {

    constructor(
        @InjectDataSource() dataSource: DataSource,
        @InjectRepository(ShiftZone)
        private readonly shiftZoneRepository: Repository<ShiftZone>,
        @Inject(forwardRef(() => UserService))
        private readonly userService: UserService,
        @Inject(forwardRef(() => ZoneService))
        private readonly zoneService: ZoneService,
    ) {
        super(dataSource, ShiftZone, 'shift_zone');
    }

    async startShiftByWaiter(createStartShift: CreateStartShiftDTO): Promise<ShiftZone> {
        const lastShift = await this.shiftZoneRepository.findOne({
            where: { waiter: { id: createStartShift.waiterId } },
            order: { createdAt: 'DESC' }
        });

        if (lastShift && lastShift.actionType === ShiftZoneActionType.START) {
            throw new BadRequestException('Waiter already has an active shift. Please end current shift before starting a new one.')
        }

        const shiftZone = this.shiftZoneRepository.create();
        const waiter = await this.userService.findOneByIdWithOptions(createStartShift.waiterId);
        const zone = await this.zoneService.findOneByIdWithOptions(createStartShift.zoneId)

        shiftZone.waiter = waiter;
        shiftZone.auditingUser = waiter;
        shiftZone.zone = zone;
        shiftZone.actionType = ShiftZoneActionType.START;

        const shift = await this.shiftZoneRepository.save(shiftZone);
        zone.currentWaiter = waiter;
        zone.status = ZoneStatus.ASSIGNED;
        await this.zoneService.zoneRepository.save(zone);
        return shift;
    }

    async endShiftByWaiter(createEndShift: CreateEndShiftDTO) {
        const lastShift = await this.shiftZoneRepository.findOne({
            where: { waiter: { id: createEndShift.waiterId } },
            order: { createdAt: 'DESC' },
            relations: ['zone', 'waiter']
        });

        if (!lastShift || ![ShiftZoneActionType.START, ShiftZoneActionType.REASSIGN].includes(lastShift.actionType)) {
            throw new BadRequestException('Waiter does not have an active shift to end.')
        }

        const shiftZone = this.shiftZoneRepository.create();
        shiftZone.waiter = shiftZone.auditingUser = lastShift.waiter;
        shiftZone.zone = lastShift.zone;
        shiftZone.actionType = ShiftZoneActionType.END;
        lastShift.zone.status = ZoneStatus.AVAILABLE;
        lastShift.zone.currentWaiter = null;
        await this.zoneService.zoneRepository.save(lastShift.zone);
        return await this.shiftZoneRepository.save(shiftZone);
    }
}