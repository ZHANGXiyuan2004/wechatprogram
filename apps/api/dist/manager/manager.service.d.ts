import { InMemoryStoreService } from '../store/store.service';
export declare class ManagerService {
    private readonly store;
    constructor(store: InMemoryStoreService);
    getDashboard(filters?: {
        departmentId?: string;
        employeeName?: string;
    }): import("@asrllm/shared-types").DashboardSummary;
    getRecords(filters?: {
        departmentId?: string;
        employeeName?: string;
    }): import("@asrllm/shared-types").RecordItem[];
    getRecordDetail(recordId: string): import("@asrllm/shared-types").ManagerRecordDetail | undefined;
}
