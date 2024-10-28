import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.get<string[]>('permissions', context.getHandler());
    console.log('PermissionsGuard - Required permissions:', requiredPermissions);
    
    if (!requiredPermissions) {
      console.log('PermissionsGuard - No permissions required');
      return true;
    }

    if (requiredPermissions.includes('public-access')) {
      console.log('PermissionsGuard - Public access granted');
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    if(!user){
        return false;
    }
    console.log('PermissionsGuard - User:', user);
    console.log('PermissionsGuard - User permissions:', user.permissions);
    
    if (user.permissions.includes('access-granted')) {
      console.log('PermissionsGuard - Access granted permission found');
      return true;
    }

    const hasPermission = requiredPermissions.some((permission) => 
      user.permissions.includes(permission)
    );
    console.log('PermissionsGuard - Has required permission:', hasPermission);
    
    return hasPermission;
  }
}