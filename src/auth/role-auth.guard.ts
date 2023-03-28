import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { Request } from 'express';

@Injectable()
export class RoleAuthGuard implements CanActivate {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  canActivate(context: ExecutionContext, ...roles: string[]): boolean {
    const request = context.switchToHttp().getRequest() as Request;
    const user = request.user as UserDocument;

    if (!user) {
      return false;
    }

    if (!roles.includes(user.role)) {
      return false;
    }

    return true;
  }
}
