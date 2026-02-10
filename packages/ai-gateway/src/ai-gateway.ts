import {
  AsrTranscribeInput,
  AsrTranscribeOutput,
  LlmGenerateInput,
  LlmGenerateOutput
} from '@asrllm/shared-types';
import { AsrProvider, LlmProvider } from './types.js';

interface RetryOptions {
  retries: number;
  initialDelayMs: number;
  maxDelayMs: number;
}

const defaultRetry: RetryOptions = {
  retries: 2,
  initialDelayMs: 200,
  maxDelayMs: 1200
};

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class AIGateway {
  private readonly llmIdempotency = new Map<string, LlmGenerateOutput>();
  private readonly asrIdempotency = new Map<string, AsrTranscribeOutput>();

  constructor(
    private readonly llmProvider: LlmProvider,
    private readonly asrProvider: AsrProvider,
    private readonly retryOptions: RetryOptions = defaultRetry
  ) {}

  async generate(input: LlmGenerateInput): Promise<LlmGenerateOutput> {
    if (input.idempotencyKey && this.llmIdempotency.has(input.idempotencyKey)) {
      return this.llmIdempotency.get(input.idempotencyKey)!;
    }

    const output = await this.withRetry(() => this.llmProvider.generate(input));

    if (input.idempotencyKey) {
      this.llmIdempotency.set(input.idempotencyKey, output);
    }
    return output;
  }

  async *stream(input: LlmGenerateInput): AsyncGenerator<string, void, unknown> {
    if (!this.llmProvider.stream) {
      const fallback = await this.generate(input);
      yield fallback.text;
      return;
    }

    for await (const chunk of this.llmProvider.stream(input)) {
      yield chunk;
    }
  }

  async transcribe(input: AsrTranscribeInput): Promise<AsrTranscribeOutput> {
    if (input.idempotencyKey && this.asrIdempotency.has(input.idempotencyKey)) {
      return this.asrIdempotency.get(input.idempotencyKey)!;
    }

    const output = await this.withRetry(() => this.asrProvider.transcribe(input));
    if (input.idempotencyKey) {
      this.asrIdempotency.set(input.idempotencyKey, output);
    }
    return output;
  }

  private async withRetry<T>(fn: () => Promise<T>): Promise<T> {
    let attempt = 0;
    let lastError: unknown;

    while (attempt <= this.retryOptions.retries) {
      try {
        return await fn();
      } catch (err) {
        lastError = err;
        if (attempt === this.retryOptions.retries) {
          break;
        }
        const delay = Math.min(
          this.retryOptions.initialDelayMs * Math.pow(2, attempt),
          this.retryOptions.maxDelayMs
        );
        await sleep(delay);
        attempt += 1;
      }
    }

    throw lastError;
  }
}
