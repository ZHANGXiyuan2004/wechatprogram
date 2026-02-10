import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Role } from '@asrllm/shared-types';
import { FastifyRequest } from 'fastify';
import { RequestUser } from './request-user';

@Injectable()
export class MockAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<FastifyRequest & { user?: RequestUser }>();
    const headers = req.headers;

    const roleHeader = String(headers['x-role'] || Role.EMPLOYEE).toUpperCase() as Role;
    const role = Object.values(Role).includes(roleHeader) ? roleHeader : Role.EMPLOYEE;

    req.user = {
      id: String(headers['x-user-id'] || 'u-emp-001'),
      name: String(headers['x-user-name'] || '演示员工'),
      role,
      departmentId: String(headers['x-department-id'] || 'dep-001'),
      departmentName: String(headers['x-department-name'] || '产品研发部')
    };

    return true;
  }
}
