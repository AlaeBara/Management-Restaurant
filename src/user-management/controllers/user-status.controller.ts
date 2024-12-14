import {
  Controller,
  ParseIntPipe,
  Param,
  Patch,
  Delete,
  Req,
  ConflictException,
  Body,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Permissions, Roles } from '../decorators/auth.decorator';
import { UserStatusService } from '../services/user/user-status.service';
import { UpdateStatusDto } from '../dto/user/update-status.dto';

@ApiTags('users/status')
@Controller('api/users')
@ApiBearerAuth()
@Roles('superadmin')
export default class UserStatusController {
  constructor(private userStatusService: UserStatusService) {}

  @Delete(':id/status/delete')
  @Permissions('update-user-status')
  @ApiOperation({ summary: 'Delete a user' })
  async markAsDeleted(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
  ) {
    const user = await this.userStatusService.findOneByIdWithOptions(id, {relations:['roles']});
    await this.userStatusService.markAsDeleted(user, request);
    return { message: 'Le compte utilisateur a été supprimé avec succès', statusCode: 200 };
  }

  @Patch(':id/status/restore')
  @Permissions('update-user-status')
  @ApiOperation({ summary: 'Restore a deleted user' })
  async markAsRestored(@Param('id', ParseIntPipe) id: number) {
    await this.userStatusService.markAsRestored(id);
    return { message: 'Le compte utilisateur a été restauré avec succès', statusCode: 200 };
  }

  @Patch(':id/status')
  @Permissions('update-user-status')
  @ApiOperation({ summary: 'Update the status of a user' })
  async markAs(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStatusDto: UpdateStatusDto,
    @Req() request: Request,
  ) {
    const user = await this.userStatusService.findOrThrow(id);
    await this.userStatusService.markAs(user, updateStatusDto.status, request);
    return { message: 'Le statut du compte utilisateur a été mis à jour avec succès', statusCode: 200 };
  }
}
