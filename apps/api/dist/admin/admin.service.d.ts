import { PromptModule } from '@asrllm/shared-types';
import { InMemoryStoreService } from '../store/store.service';
export declare class AdminService {
    private readonly store;
    constructor(store: InMemoryStoreService);
    listPrompts(module?: PromptModule): import("@asrllm/shared-types").PromptTemplate[];
    listPromptAuditLogs(module?: PromptModule): import("@asrllm/shared-types").PromptAuditLog[];
    createPrompt(module: PromptModule, content: string, operator: string, publish?: boolean): import("@asrllm/shared-types").PromptTemplate;
    publishPrompt(id: string, operator: string): import("@asrllm/shared-types").PromptTemplate;
    rollbackPrompt(module: PromptModule, version: number, operator: string): import("@asrllm/shared-types").PromptTemplate;
}
