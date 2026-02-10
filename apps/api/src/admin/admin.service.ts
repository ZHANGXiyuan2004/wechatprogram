import { PromptModule } from '@asrllm/shared-types';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InMemoryStoreService } from '../store/store.service';

@Injectable()
export class AdminService {
  constructor(private readonly store: InMemoryStoreService) {}

  listPrompts(module?: PromptModule) {
    return this.store.listPrompts(module);
  }

  listPromptAuditLogs(module?: PromptModule) {
    return this.store.listPromptAuditLogs(module);
  }

  createPrompt(module: PromptModule, content: string, operator: string, publish?: boolean) {
    return this.store.createPromptTemplate(module, content, operator, publish);
  }

  publishPrompt(id: string, operator: string) {
    const prompt = this.store.publishPromptTemplate(id, operator);
    if (!prompt) {
      throw new NotFoundException('Prompt template not found');
    }
    return prompt;
  }

  rollbackPrompt(module: PromptModule, version: number, operator: string) {
    const prompt = this.store.rollbackPromptTemplate(module, version, operator);
    if (!prompt) {
      throw new NotFoundException('Prompt template not found for target version');
    }
    return prompt;
  }
}
