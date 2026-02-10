import { GenerateOutlineRequest, OutlineGenerateResponse, PolishResponse } from '@asrllm/shared-types';
import { AIService } from '../ai/ai.service';
import { InMemoryStoreService } from '../store/store.service';
export declare class PracticeService {
    private readonly store;
    private readonly ai;
    constructor(store: InMemoryStoreService, ai: AIService);
    createPractice(userId: string, topic: string): import("@asrllm/shared-types").Practice;
    generateOutline(practiceId: string, payload: GenerateOutlineRequest): Promise<OutlineGenerateResponse>;
    streamOutline(practiceId: string): AsyncGenerator<string, void, unknown>;
    createRecordingPresign(practiceId: string, input: {
        fileName: string;
        contentType: string;
        durationSec: number;
    }): {
        recordingId: string;
        uploadUrl: string;
        objectKey: string;
    };
    createAsrJob(practiceId: string, recordingId: string): Promise<import("@asrllm/shared-types").AsrJob>;
    getAsrJob(practiceId: string, jobId: string): import("@asrllm/shared-types").AsrJob;
    polish(practiceId: string, sourceText: string): Promise<PolishResponse>;
}
