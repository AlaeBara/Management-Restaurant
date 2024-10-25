import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

interface JwtPayload {
  username: string;
  sub: number;
  roles: string[];
  permissions: string[];
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    const requiredPermissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );

    if (!requiredRoles && !requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];
    if (!token) {
      return false;
    }

    try {
      //const decoded = this.jwtService.verify<JwtPayload>(token);
      const decoded = this.jwtService.verify(token);
      const userRoles = decoded.roles;

      const userPermissions = decoded.permissions;

      if (userPermissions.includes('garanted-access')) {
        return true;
      }

      if (
        requiredRoles &&
        !requiredRoles.some((role) => userRoles.includes(role))
      ) {
        return false;
      }

      if (
        requiredPermissions &&
        !requiredPermissions.some((permission) =>
          userPermissions.includes(permission),
        )
      ) {
        return false;
      }

      return true;
    } catch (err) {
      return false;
    }
  }
}
