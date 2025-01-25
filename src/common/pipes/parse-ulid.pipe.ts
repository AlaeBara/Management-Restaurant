import {
    PipeTransform,
    Injectable,
    BadRequestException
} from '@nestjs/common';
import * as ULID from 'ulid';

@Injectable()
export class ParseULIDPipe implements PipeTransform<string> {
    transform(value: string): string {
        try {
            ULID.decodeTime(value);
            return value;
        } catch (error) {
            throw new BadRequestException('Invalid ULID format');
        }
    }
}