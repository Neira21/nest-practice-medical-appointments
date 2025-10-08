import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthUser } from '../interfaces/auth-user.interface';

interface RequestWithUser {
  user: AuthUser;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const role = this.reflector.getAllAndOverride<string>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!role) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest<RequestWithUser>();

    return role === user.role;
  }
}
