
import {
    InjectDataSource,
    InjectRepository
} from "@nestjs/typeorm";
import {
    DataSource,
    Repository,
    UpdateResult
} from "typeorm";

import { GenericService } from "src/common/services/generic.service";
import { Guest } from "../entities/guest.entity";
import { UpdateGuestDto } from "../dtos/guest/update-guest.dto";
import { CreateGuestDto } from "../dtos/guest/create-guest.dto";
import logger from "src/common/Loggers/logger";

export class GuestService extends GenericService<Guest> {

    constructor(
        @InjectDataSource() dataSource: DataSource,
        @InjectRepository(Guest)
        private guestRepository: Repository<Guest>,
    ) {
        super(dataSource, Guest, 'guest');
    }

    async getOrCreateGuest(createGuestDto: CreateGuestDto): Promise<Guest> {
        let guests: Guest[];

        try {
            guests = await this.guestRepository.find({
                where: [
                    { fullname: createGuestDto.fullname },
                    { phoneNumber: createGuestDto.phoneNumber },
                    { email: createGuestDto.email },
                ],
            });

            if (guests.length === 0) {
                return await this.createGuest(createGuestDto);
            }

            // If we have exact match (all fields match), use that guest
            const exactMatch = guests.find(guest => 
                guest.fullname === createGuestDto.fullname &&
                guest.phoneNumber === createGuestDto.phoneNumber &&
                guest.email === createGuestDto.email
            );

            if (exactMatch) {
                return exactMatch;
            }

            // If we have multiple partial matches, use the first one but log a warning
            if (guests.length > 1) {
                logger.warn('Multiple guests found with similar details:', {
                    searchCriteria: createGuestDto,
                    foundGuests: guests.map(g => ({ id: g.id, fullname: g.fullname, phoneNumber: g.phoneNumber, email: g.email }))
                });
            }

            return await this.modifyGuest(guests[0], createGuestDto);

        } catch (error) {
            logger.error('Error finding/creating guest:', { message: error.message, stack: error.stack });
            throw error;
        }
    }

    async createGuest(createGuestDto: CreateGuestDto): Promise<Guest> {
        const guest = this.guestRepository.create(createGuestDto);

        return this.guestRepository.save(guest);
    }

    private async modifyGuest(guest: Guest, updateGuestDto: UpdateGuestDto): Promise<Guest> {
        return this.guestRepository.save({ ...guest, ...updateGuestDto });
    }

    async updateGuest(id: string, updateGuestDto: UpdateGuestDto): Promise<Guest> {
        const guest = await this.findOneByIdWithOptions(id);

        await this.validateUniqueExcludingSelf({
            fullname: updateGuestDto.fullname,
            phoneNumber: updateGuestDto.phoneNumber,
            email: updateGuestDto.email,
        }, id);

        return this.guestRepository.save({ ...guest, ...updateGuestDto });
    }

    async deleteGuest(id: string): Promise<UpdateResult> {
        await this.findOneByIdWithOptions(id);

        return this.softDelete(id);
    }

}
