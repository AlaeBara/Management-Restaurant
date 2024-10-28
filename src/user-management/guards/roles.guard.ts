import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    console.log('RolesGuard - Required roles:', requiredRoles);
    
    if (!requiredRoles) {
      console.log('RolesGuard - No roles required');
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    if(!user){
        return false;
    }
    console.log('RolesGuard - User:', user);
    console.log('RolesGuard - User roles:', user.roles);
    
    const hasRole = requiredRoles.some((role) => user.roles.includes(role));
    console.log('RolesGuard - Has required role:', hasRole);
    
    return hasRole;
  }
}