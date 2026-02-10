import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@asrllm/shared-types';
import { FastifyRequest } from 'fastify';
import { ROLES_KEY } from './roles.decorator';
import { RequestUser } from './request-user';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass()
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const req = context.switchToHttp().getRequest<FastifyRequest & { user?: RequestUser }>();
    const user = req.user;
    if (!user) {
      throw new ForbiddenException('Unauthenticated');
    }

    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Permission denied');
    }

    return true;
  }
}
