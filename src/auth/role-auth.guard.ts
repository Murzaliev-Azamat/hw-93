import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserDocument } from '../schemas/user.schema';
import { Request } from 'express';

@Injectable()
export class RoleAuthGuard implements CanActivate {
  constructor(private roles: string[]) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.roles;
    const request = context.switchToHttp().getRequest() as Request;
    const user = request.user as UserDocument;

    if (!user) {
      return false;
    }

    return requiredRoles.includes(user.role);
  }
}
