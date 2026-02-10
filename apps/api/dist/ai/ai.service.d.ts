import { LlmGenerateOutput, OutlineStyle } from '@asrllm/shared-types';
import { InMemoryStoreService } from '../store/store.service';
export declare class AIService {
    private readonly store;
    private readonly gateway;
    private readonly promptResolver;
    constructor(store: InMemoryStoreService);
    generateOutline(params: {
        topic: string;
        style: OutlineStyle;
        level?: string;
        backgroundTags?: string[];
        idempotencyKey?: string;
    }): Promise<LlmGenerateOutput>;
    streamOutline(params: {
        topic: string;
        style: OutlineStyle;
        level?: string;
        backgroundTags?: string[];
        idempotencyKey?: string;
    }): AsyncGenerator<string, void, unknown>;
    transcribe(objectKey: string, idempotencyKey?: string): Promise<import("@asrllm/shared-types").AsrTranscribeOutput>;
    polish(sourceText: string, idempotencyKey?: string): Promise<LlmGenerateOutput>;
}
