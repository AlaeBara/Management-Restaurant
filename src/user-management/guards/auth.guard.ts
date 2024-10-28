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
  ) { }

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    console.log('AuthGuard - Required roles:', requiredRoles);

    const requiredPermissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );
    console.log('AuthGuard - Required permissions:', requiredPermissions);

    if (!requiredRoles && !requiredPermissions) {
      console.log('AuthGuard - No roles or permissions required');
      return true;
    }

    if (requiredPermissions?.includes('public-access')) {
      console.log('AuthGuard - Public access granted');
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];
    console.log('AuthGuard - Authorization token:', token);

    if (!token) {
      console.log('AuthGuard - No token found');
      return false;
    }

    try {
      //const decoded = this.jwtService.verify<JwtPayload>(token);
      const decoded = this.jwtService.verify(token);
      console.log('AuthGuard - Decoded token:', decoded);

      const userRoles = decoded.roles;
      console.log('AuthGuard - User roles:', userRoles);

      const userPermissions = decoded.permissions;
      console.log('AuthGuard - User permissions:', userPermissions);

      if (userPermissions.includes('access-granted')) {
        console.log('AuthGuard - Access granted permission found');
        return true;
      }

      if (
        requiredRoles &&
        !requiredRoles.some((role) => userRoles.includes(role))
      ) {
        console.log('AuthGuard - Required role not found');
        return false;
      }

      if (
        requiredPermissions &&
        !requiredPermissions.some((permission) =>
          userPermissions.includes(permission),
        )
      ) {
        console.log('AuthGuard - Required permission not found');
        return false;
      }

      console.log('AuthGuard - All checks passed');
      return true;
    } catch (err) {
      console.log('AuthGuard - Token verification failed:', err.message);
      return false;
    }
  }
}
