import { Role } from '@asrllm/shared-types';

export interface RequestUser {
  id: string;
  name: string;
  role: Role;
  departmentId: string;
  departmentName: string;
}
