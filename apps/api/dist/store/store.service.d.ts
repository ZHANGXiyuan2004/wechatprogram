import { AsrJob, DashboardSummary, DiffChange, ManagerRecordDetail, OutlineStyle, Practice, PracticeStatus, PromptAuditLog, PromptModule, PromptTemplate, RecordItem, UserProfile } from '@asrllm/shared-types';
interface Department {
    id: string;
    name: string;
    parentId?: string;
}
interface OutlineRecord {
    id: string;
    practiceId: string;
    style: OutlineStyle;
    content: string;
    promptTokens: number;
    completionTokens: number;
    latencyMs: number;
    createdAt: string;
}
interface RecordingRecord {
    id: string;
    practiceId: string;
    objectKey: string;
    uploadUrl: string;
    durationSec: number;
    contentType: string;
    uploadStatus: 'PENDING' | 'UPLOADED';
    createdAt: string;
}
interface PolishRecord {
    id: string;
    practiceId: string;
    sourceText: string;
    polishedText: string;
    changes: DiffChange[];
    score: number;
    createdAt: string;
}
export interface DeletionJob {
    id: string;
    entity: string;
    entityId: string;
    status: 'PENDING' | 'RUNNING' | 'DONE' | 'FAILED';
    createdAt: string;
    updatedAt: string;
}
export declare class InMemoryStoreService {
    readonly departments: Department[];
    readonly users: UserProfile[];
    readonly practices: Practice[];
    readonly outlines: OutlineRecord[];
    readonly recordings: RecordingRecord[];
    readonly asrJobs: AsrJob[];
    readonly polishRecords: PolishRecord[];
    readonly promptTemplates: PromptTemplate[];
    readonly promptAuditLogs: PromptAuditLog[];
    readonly deletionJobs: DeletionJob[];
    constructor();
    private seedPrompts;
    createPractice(userId: string, topic: string): Practice;
    getPracticeById(id: string): Practice | undefined;
    updatePracticeStatus(id: string, status: PracticeStatus): Practice | undefined;
    createOutline(practiceId: string, style: OutlineStyle, content: string, tokenUsage: {
        promptTokens: number;
        completionTokens: number;
    }, latencyMs: number): OutlineRecord;
    getOutlineByPracticeId(practiceId: string): OutlineRecord | undefined;
    createRecording(practiceId: string, durationSec: number, contentType: string, fileName: string): RecordingRecord;
    getRecordingById(id: string): RecordingRecord | undefined;
    markRecordingUploaded(id: string): void;
    createAsrJob(practiceId: string, recordingId: string): AsrJob;
    updateAsrJob(jobId: string, patch: Partial<AsrJob>): AsrJob | undefined;
    getAsrJobById(jobId: string): AsrJob | undefined;
    getAsrJobByPracticeId(practiceId: string): AsrJob | undefined;
    createPolish(practiceId: string, sourceText: string, polishedText: string, changes: DiffChange[]): PolishRecord;
    getPolishByPracticeId(practiceId: string): PolishRecord | undefined;
    createPromptTemplate(module: PromptModule, content: string, createdBy: string, publish?: boolean): PromptTemplate;
    publishPromptTemplate(id: string, operator: string): PromptTemplate | undefined;
    rollbackPromptTemplate(module: PromptModule, version: number, operator: string): PromptTemplate | undefined;
    listPrompts(module?: PromptModule): PromptTemplate[];
    getActivePrompt(module: PromptModule, version?: number): string | undefined;
    private createPromptAudit;
    listPromptAuditLogs(module?: PromptModule): PromptAuditLog[];
    getDashboardSummary(filters?: {
        departmentId?: string;
        employeeName?: string;
    }): DashboardSummary;
    listManagerRecords(filters?: {
        departmentId?: string;
        employeeName?: string;
    }): RecordItem[];
    getManagerRecordDetail(practiceId: string): ManagerRecordDetail | undefined;
    createDeletionJob(entity: string, entityId: string): DeletionJob;
    private runDeletion;
    deletePractice(practiceId: string): void;
    deleteRecording(recordingId: string): void;
    deleteUser(userId: string): void;
    cleanupExpiredData(days?: number): number;
    private removeBy;
    buildPolishResult(sourceText: string): {
        polishedText: string;
        changes: DiffChange[];
    };
}
export {};
