import { Role, UserProfile } from '@asrllm/shared-types';
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { InMemoryStoreService } from '../store/store.service';

@Injectable()
export class AuthService {
  constructor(private readonly store: InMemoryStoreService) {}

  async wecomLogin(code: string): Promise<{ accessToken: string; user: UserProfile }> {
    const fallbackUser = this.store.users[0];

    // Demo mapping: code contains role keyword for quick testing.
    const mappedRole = code.includes('admin')
      ? Role.ADMIN
      : code.includes('manager')
        ? Role.MANAGER
        : Role.EMPLOYEE;

    const user = this.store.users.find((u) => u.role === mappedRole) || fallbackUser;

    return {
      accessToken: `mock-jwt-${randomUUID()}`,
      user
    };
  }
}
