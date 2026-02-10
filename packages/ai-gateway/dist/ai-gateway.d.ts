import { AsrTranscribeInput, AsrTranscribeOutput, LlmGenerateInput, LlmGenerateOutput } from '@asrllm/shared-types';
import { AsrProvider, LlmProvider } from './types.js';
interface RetryOptions {
    retries: number;
    initialDelayMs: number;
    maxDelayMs: number;
}
export declare class AIGateway {
    private readonly llmProvider;
    private readonly asrProvider;
    private readonly retryOptions;
    private readonly llmIdempotency;
    private readonly asrIdempotency;
    constructor(llmProvider: LlmProvider, asrProvider: AsrProvider, retryOptions?: RetryOptions);
    generate(input: LlmGenerateInput): Promise<LlmGenerateOutput>;
    stream(input: LlmGenerateInput): AsyncGenerator<string, void, unknown>;
    transcribe(input: AsrTranscribeInput): Promise<AsrTranscribeOutput>;
    private withRetry;
}
export {};
