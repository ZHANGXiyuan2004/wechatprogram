import { describe, expect, it } from 'vitest';
import { PromptModule } from '@asrllm/shared-types';
import { AIGateway } from './ai-gateway';
import { TencentAsrProvider } from './providers/tencent-asr-provider';
import { TencentLlmProvider } from './providers/tencent-llm-provider';
describe('AIGateway', () => {
    it('should cache llm response with idempotency key', async () => {
        const gateway = new AIGateway(new TencentLlmProvider(), new TencentAsrProvider());
        const first = await gateway.generate({
            module: PromptModule.OUTLINE,
            prompt: 'topic',
            idempotencyKey: 'k1'
        });
        const second = await gateway.generate({
            module: PromptModule.OUTLINE,
            prompt: 'topic-new',
            idempotencyKey: 'k1'
        });
        expect(second.text).toBe(first.text);
    });
});
