"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIService = void 0;
const ai_gateway_1 = require("@asrllm/ai-gateway");
const shared_types_1 = require("@asrllm/shared-types");
const common_1 = require("@nestjs/common");
const store_service_1 = require("../store/store.service");
let AIService = class AIService {
    constructor(store) {
        this.store = store;
        this.promptResolver = new ai_gateway_1.DefaultPromptResolver({
            getActivePrompt: async (module, version) => this.store.getActivePrompt(module, version)
        });
        this.gateway = new ai_gateway_1.AIGateway(new ai_gateway_1.TencentLlmProvider(), new ai_gateway_1.TencentAsrProvider());
    }
    async generateOutline(params) {
        const prompt = await this.promptResolver.resolve({
            module: shared_types_1.PromptModule.OUTLINE,
            variables: {
                topic: params.topic,
                style: params.style,
                level: params.level || '',
                backgroundTags: (params.backgroundTags || []).join(',')
            }
        });
        return this.gateway.generate({
            module: shared_types_1.PromptModule.OUTLINE,
            prompt,
            idempotencyKey: params.idempotencyKey
        });
    }
    async *streamOutline(params) {
        const prompt = await this.promptResolver.resolve({
            module: shared_types_1.PromptModule.OUTLINE,
            variables: {
                topic: params.topic,
                style: params.style,
                level: params.level || '',
                backgroundTags: (params.backgroundTags || []).join(',')
            }
        });
        for await (const chunk of this.gateway.stream({
            module: shared_types_1.PromptModule.OUTLINE,
            prompt,
            stream: true,
            idempotencyKey: params.idempotencyKey
        })) {
            yield chunk;
        }
    }
    async transcribe(objectKey, idempotencyKey) {
        return this.gateway.transcribe({
            objectKey,
            idempotencyKey
        });
    }
    async polish(sourceText, idempotencyKey) {
        const prompt = await this.promptResolver.resolve({
            module: shared_types_1.PromptModule.POLISH,
            variables: { sourceText }
        });
        return this.gateway.generate({
            module: shared_types_1.PromptModule.POLISH,
            prompt,
            idempotencyKey
        });
    }
};
exports.AIService = AIService;
exports.AIService = AIService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [store_service_1.InMemoryStoreService])
], AIService);
//# sourceMappingURL=ai.service.js.map