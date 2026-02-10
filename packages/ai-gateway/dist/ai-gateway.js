const defaultRetry = {
    retries: 2,
    initialDelayMs: 200,
    maxDelayMs: 1200
};
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
export class AIGateway {
    llmProvider;
    asrProvider;
    retryOptions;
    llmIdempotency = new Map();
    asrIdempotency = new Map();
    constructor(llmProvider, asrProvider, retryOptions = defaultRetry) {
        this.llmProvider = llmProvider;
        this.asrProvider = asrProvider;
        this.retryOptions = retryOptions;
    }
    async generate(input) {
        if (input.idempotencyKey && this.llmIdempotency.has(input.idempotencyKey)) {
            return this.llmIdempotency.get(input.idempotencyKey);
        }
        const output = await this.withRetry(() => this.llmProvider.generate(input));
        if (input.idempotencyKey) {
            this.llmIdempotency.set(input.idempotencyKey, output);
        }
        return output;
    }
    async *stream(input) {
        if (!this.llmProvider.stream) {
            const fallback = await this.generate(input);
            yield fallback.text;
            return;
        }
        for await (const chunk of this.llmProvider.stream(input)) {
            yield chunk;
        }
    }
    async transcribe(input) {
        if (input.idempotencyKey && this.asrIdempotency.has(input.idempotencyKey)) {
            return this.asrIdempotency.get(input.idempotencyKey);
        }
        const output = await this.withRetry(() => this.asrProvider.transcribe(input));
        if (input.idempotencyKey) {
            this.asrIdempotency.set(input.idempotencyKey, output);
        }
        return output;
    }
    async withRetry(fn) {
        let attempt = 0;
        let lastError;
        while (attempt <= this.retryOptions.retries) {
            try {
                return await fn();
            }
            catch (err) {
                lastError = err;
                if (attempt === this.retryOptions.retries) {
                    break;
                }
                const delay = Math.min(this.retryOptions.initialDelayMs * Math.pow(2, attempt), this.retryOptions.maxDelayMs);
                await sleep(delay);
                attempt += 1;
            }
        }
        throw lastError;
    }
}
