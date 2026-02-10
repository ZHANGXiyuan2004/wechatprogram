import {
  AIGateway,
  DefaultPromptResolver,
  TencentAsrProvider,
  TencentLlmProvider
} from '@asrllm/ai-gateway';
import { LlmGenerateOutput, OutlineStyle, PromptModule } from '@asrllm/shared-types';
import { Injectable } from '@nestjs/common';
import { InMemoryStoreService } from '../store/store.service';

@Injectable()
export class AIService {
  private readonly gateway: AIGateway;
  private readonly promptResolver: DefaultPromptResolver;

  constructor(private readonly store: InMemoryStoreService) {
    this.promptResolver = new DefaultPromptResolver({
      getActivePrompt: async (module, version) => this.store.getActivePrompt(module, version)
    });
    this.gateway = new AIGateway(new TencentLlmProvider(), new TencentAsrProvider());
  }

  async generateOutline(params: {
    topic: string;
    style: OutlineStyle;
    level?: string;
    backgroundTags?: string[];
    idempotencyKey?: string;
  }): Promise<LlmGenerateOutput> {
    const prompt = await this.promptResolver.resolve({
      module: PromptModule.OUTLINE,
      variables: {
        topic: params.topic,
        style: params.style,
        level: params.level || '',
        backgroundTags: (params.backgroundTags || []).join(',')
      }
    });

    return this.gateway.generate({
      module: PromptModule.OUTLINE,
      prompt,
      idempotencyKey: params.idempotencyKey
    });
  }

  async *streamOutline(params: {
    topic: string;
    style: OutlineStyle;
    level?: string;
    backgroundTags?: string[];
    idempotencyKey?: string;
  }): AsyncGenerator<string, void, unknown> {
    const prompt = await this.promptResolver.resolve({
      module: PromptModule.OUTLINE,
      variables: {
        topic: params.topic,
        style: params.style,
        level: params.level || '',
        backgroundTags: (params.backgroundTags || []).join(',')
      }
    });

    for await (const chunk of this.gateway.stream({
      module: PromptModule.OUTLINE,
      prompt,
      stream: true,
      idempotencyKey: params.idempotencyKey
    })) {
      yield chunk;
    }
  }

  async transcribe(objectKey: string, idempotencyKey?: string) {
    return this.gateway.transcribe({
      objectKey,
      idempotencyKey
    });
  }

  async polish(sourceText: string, idempotencyKey?: string) {
    const prompt = await this.promptResolver.resolve({
      module: PromptModule.POLISH,
      variables: { sourceText }
    });

    return this.gateway.generate({
      module: PromptModule.POLISH,
      prompt,
      idempotencyKey
    });
  }
}
