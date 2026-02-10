import { ManagerService } from './manager.service';
export declare class ManagerController {
    private readonly managerService;
    constructor(managerService: ManagerService);
    dashboard(departmentId?: string, employeeName?: string): import("@asrllm/shared-types").DashboardSummary;
    records(departmentId?: string, employeeName?: string): import("@asrllm/shared-types").RecordItem[];
    recordDetail(recordId: string): import("@asrllm/shared-types").ManagerRecordDetail;
}
