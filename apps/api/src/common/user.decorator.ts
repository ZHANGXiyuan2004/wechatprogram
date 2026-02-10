import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { RequestUser } from './request-user';

export const CurrentUser = createParamDecorator(
  (_: unknown, context: ExecutionContext): RequestUser => {
    const req = context.switchToHttp().getRequest<FastifyRequest & { user?: RequestUser }>();
    return req.user!;
  }
);
