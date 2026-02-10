import { LlmGenerateInput, LlmGenerateOutput } from '@asrllm/shared-types';
import { LlmProvider } from '../types.js';
export declare class TencentLlmProvider implements LlmProvider {
    generate(input: LlmGenerateInput): Promise<LlmGenerateOutput>;
    stream(input: LlmGenerateInput): AsyncGenerator<string, void, unknown>;
}
