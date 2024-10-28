import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );

    const classRoles = this.reflector.get<string[]>(
      'roles',
      context.getClass(),
    );

    const allRequiredRoles = [...(requiredRoles || []), ...(classRoles || [])];
    console.log('RolesGuard - All required roles:', allRequiredRoles);

    if (!allRequiredRoles.length) {
      console.log('RolesGuard - No roles required, allowing access');
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user || !user.roles || !Array.isArray(user.roles)) {
      console.log(
        'RolesGuard - Invalid user /roles, throwing UnauthorizedException',
      );
      throw new UnauthorizedException();
    }

    console.log('RolesGuard - User roles:', user.roles);

    const hasRole = requiredRoles.some((role) => user.roles.includes(role));
    console.log('RolesGuard - Has required role:', hasRole);

    return hasRole;
  }
}
