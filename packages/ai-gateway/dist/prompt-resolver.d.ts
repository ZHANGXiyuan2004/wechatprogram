import { PromptResolveInput } from '@asrllm/shared-types';
import { PromptResolver, PromptTemplateProvider } from './types.js';
export declare class DefaultPromptResolver implements PromptResolver {
    private readonly promptProvider;
    constructor(promptProvider: PromptTemplateProvider);
    resolve(input: PromptResolveInput): Promise<string>;
}
