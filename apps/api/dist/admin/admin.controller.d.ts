import { PromptModule } from '@asrllm/shared-types';
import { RequestUser } from '../common/request-user';
import { CreatePromptTemplateDto, RollbackPromptTemplateDto } from './admin.dto';
import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    listPrompts(module?: PromptModule): {
        templates: import("@asrllm/shared-types").PromptTemplate[];
        auditLogs: import("@asrllm/shared-types").PromptAuditLog[];
    };
    createPrompt(user: RequestUser, body: CreatePromptTemplateDto): import("@asrllm/shared-types").PromptTemplate;
    publishPrompt(user: RequestUser, id: string): import("@asrllm/shared-types").PromptTemplate;
    rollbackPrompt(user: RequestUser, body: RollbackPromptTemplateDto): import("@asrllm/shared-types").PromptTemplate;
    rollbackPromptCompat(user: RequestUser, body: RollbackPromptTemplateDto): import("@asrllm/shared-types").PromptTemplate;
}
