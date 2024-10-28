import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );

    const classPermissions = this.reflector.get<string[]>(
      'permissions',
      context.getClass(),
    );

    const allRequiredPermissions = [
      ...(requiredPermissions || []),
      ...(classPermissions || []),
    ];
    console.log(
      'PermissionsGuard - All required permissions:',
      allRequiredPermissions,
    );

    if (!allRequiredPermissions.length) {
      console.log(
        'PermissionsGuard - No permissions required, allowing access',
      );
      return true;
    }

    if (allRequiredPermissions.includes('public-access')) {
      console.log(
        'PermissionsGuard - Public access permission found, allowing access',
      );
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user || !user.permissions || !Array.isArray(user.permissions)) {
      console.log(
        'PermissionsGuard - Invalid user or permissions, throwing UnauthorizedException',
      );
      throw new UnauthorizedException();
    }

    console.log('PermissionsGuard - User permissions:', user.permissions);

    if (user.permissions.includes('access-granted')) {
      console.log(
        'PermissionsGuard - User has access-granted permission, allowing access',
      );
      return true;
    }

    const hasPermission = allRequiredPermissions.some((permission) =>
      user.permissions.includes(permission),
    );
    console.log('PermissionsGuard - Has required permission:', hasPermission);

    return hasPermission;
  }
}
