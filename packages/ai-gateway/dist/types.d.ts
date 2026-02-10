import { AsrTranscribeInput, AsrTranscribeOutput, LlmGenerateInput, LlmGenerateOutput, PromptModule, PromptResolveInput } from '@asrllm/shared-types';
export interface PromptTemplateProvider {
    getActivePrompt(module: PromptModule, version?: number): Promise<string | undefined>;
}
export interface PromptResolver {
    resolve(input: PromptResolveInput): Promise<string>;
}
export interface LlmProvider {
    generate(input: LlmGenerateInput): Promise<LlmGenerateOutput>;
    stream?(input: LlmGenerateInput): AsyncGenerator<string, void, unknown>;
}
export interface AsrProvider {
    transcribe(input: AsrTranscribeInput): Promise<AsrTranscribeOutput>;
}
