import {
  Controller,
  ParseIntPipe,
  Param,
  Patch,
  Delete,
  Req,
  ConflictException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Permissions, Roles } from '../decorators/auth.decorator';
import { UserStatusService } from '../services/user/user-status.service';

@ApiTags('users/status')
@Controller('api/users')
@Roles('superadmin')
export default class UserStatusController {
  constructor(private userStatusService: UserStatusService) {}

  /* private userStatusPermissions = [
    { permission: 'update-user-status', label: 'Update user status', resource: 'user' }, 
  ]; */

  @Patch(':id/status/block')
  @Permissions('update-user-status')
  async markAsBlocked(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
  ) {
    const user = await this.userStatusService.findOrThrow(id);
    await this.userStatusService.markAsBlocked(user, request);
    return { message: 'User status updated successfully', statusCode: 200 };
  }

  @Patch(':id/status/active')
  @Permissions('update-user-status')
  async markAsActive(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
  ) {
    const user = await this.userStatusService.findOrThrow(id);
    await this.userStatusService.markAsActive(user, request);
    return { message: 'User status updated successfully', statusCode: 200 };
  }

  @Delete(':id/status/delete')
  @Permissions('update-user-status')
  async markAsDeleted(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
  ) {
    const user = await this.userStatusService.findOrThrow(id);
    await this.userStatusService.markAsDeleted(user, request);
    return { message: 'User status updated successfully', statusCode: 200 };
  }

  @Patch(':id/status/restore')
  @Permissions('update-user-status')
  async markAsRestored(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userStatusService.findOrThrow(id, [], true);
    if (!user.deletedAt) {
      throw new ConflictException('User is not deleted');
    }
    await this.userStatusService.markAsRestored(id);
    return { message: 'User status updated successfully', statusCode: 200 };
  }

  @Patch(':id/status/archive')
  @Permissions('update-user-status')
  async markAsArchived(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
  ) {
    const user = await this.userStatusService.findOrThrow(id);
    await this.userStatusService.markAsArchived(user, request);
    return { message: 'User status updated successfully', statusCode: 200 };
  }

  @Patch(':id/status/inactive')
  @Permissions('update-user-status')
  async markAsInactive(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
  ) {
    const user = await this.userStatusService.findOrThrow(id);
    await this.userStatusService.markAsInactive(user, request);
    return { message: 'User status updated successfully', statusCode: 200 };
  }

  @Patch(':id/status/ban')
  @Permissions('update-user-status')
  async markAsBanned(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
  ) {
    const user = await this.userStatusService.findOrThrow(id);
    await this.userStatusService.markAsBanned(user, request);
    return { message: 'User status updated successfully', statusCode: 200 };
  }
}