import { Injectable } from '@nestjs/common';
import { InMemoryStoreService } from '../store/store.service';

@Injectable()
export class ManagerService {
  constructor(private readonly store: InMemoryStoreService) {}

  getDashboard(filters?: { departmentId?: string; employeeName?: string }) {
    return this.store.getDashboardSummary(filters);
  }

  getRecords(filters?: { departmentId?: string; employeeName?: string }) {
    return this.store.listManagerRecords(filters);
  }

  getRecordDetail(recordId: string) {
    return this.store.getManagerRecordDetail(recordId);
  }
}
