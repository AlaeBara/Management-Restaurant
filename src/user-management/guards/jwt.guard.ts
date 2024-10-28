import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService,private reflector:Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];
    const requiredPermissions = this.reflector.get<string[]>('permissions', context.getHandler());
    console.log('PermissionsGuard - Required permissions:', requiredPermissions);
    
    if(!requiredPermissions){
        return false;
    }
    if (requiredPermissions.includes('public-access')) {
      console.log('PermissionsGuard - Public access granted');
      return true;
    }
    console.log('JWT Guard - Authorization Token:', token);
    
    if (!token) {
      console.log('JWT Guard - No token found');
      return false;
    }

    try {
      const decoded = this.jwtService.verify(token);
      console.log('JWT Guard - Decoded token:', decoded);
      // Attach decoded token to request for use in other guards
      request.user = decoded;
      return true;
    } catch (err) {
      console.log('JWT Guard - Token verification failed:', err.message);
      return false;
    }
  }
}