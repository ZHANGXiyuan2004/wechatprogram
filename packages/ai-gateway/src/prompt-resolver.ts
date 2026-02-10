import { PromptResolveInput } from '@asrllm/shared-types';
import { PromptResolver, PromptTemplateProvider } from './types.js';

const VAR_PATTERN = /\{\{\s*(\w+)\s*\}\}/g;

export class DefaultPromptResolver implements PromptResolver {
  constructor(private readonly promptProvider: PromptTemplateProvider) {}

  async resolve(input: PromptResolveInput): Promise<string> {
    const template =
      (await this.promptProvider.getActivePrompt(input.module, input.version)) ||
      '你是企业口语训练助手，请在保持原意的前提下输出专业、结构化的内容。';

    return template.replace(VAR_PATTERN, (_, key: string) => input.variables[key] ?? '');
  }
}
