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
exports.PracticeService = void 0;
const shared_types_1 = require("@asrllm/shared-types");
const common_1 = require("@nestjs/common");
const ai_service_1 = require("../ai/ai.service");
const store_service_1 = require("../store/store.service");
let PracticeService = class PracticeService {
    constructor(store, ai) {
        this.store = store;
        this.ai = ai;
    }
    createPractice(userId, topic) {
        return this.store.createPractice(userId, topic);
    }
    async generateOutline(practiceId, payload) {
        const practice = this.store.getPracticeById(practiceId);
        if (!practice) {
            throw new common_1.NotFoundException('Practice not found');
        }
        const llm = await this.ai.generateOutline({
            topic: practice.topic,
            style: payload.style,
            level: payload.level,
            backgroundTags: payload.backgroundTags,
            idempotencyKey: `outline-${practiceId}-${payload.style}`
        });
        const record = this.store.createOutline(practiceId, payload.style, llm.text, llm.tokenUsage || { promptTokens: 0, completionTokens: 0 }, llm.latencyMs);
        return {
            outlineId: record.id,
            practiceId,
            style: payload.style,
            content: llm.text,
            latencyMs: llm.latencyMs
        };
    }
    streamOutline(practiceId) {
        const practice = this.store.getPracticeById(practiceId);
        if (!practice) {
            throw new common_1.NotFoundException('Practice not found');
        }
        const outline = this.store.getOutlineByPracticeId(practiceId);
        if (!outline) {
            throw new common_1.BadRequestException('Outline not generated yet, call /outline/generate first');
        }
        return this.ai.streamOutline({
            topic: practice.topic,
            style: outline.style,
            idempotencyKey: `stream-${practiceId}-${outline.style}`
        });
    }
    createRecordingPresign(practiceId, input) {
        const practice = this.store.getPracticeById(practiceId);
        if (!practice) {
            throw new common_1.NotFoundException('Practice not found');
        }
        const rec = this.store.createRecording(practiceId, input.durationSec, input.contentType, input.fileName);
        return {
            recordingId: rec.id,
            uploadUrl: rec.uploadUrl,
            objectKey: rec.objectKey
        };
    }
    async createAsrJob(practiceId, recordingId) {
        const practice = this.store.getPracticeById(practiceId);
        if (!practice) {
            throw new common_1.NotFoundException('Practice not found');
        }
        const recording = this.store.getRecordingById(recordingId);
        if (!recording) {
            throw new common_1.NotFoundException('Recording not found');
        }
        this.store.markRecordingUploaded(recordingId);
        const job = this.store.createAsrJob(practiceId, recordingId);
        this.store.updateAsrJob(job.id, { status: shared_types_1.AsrJobStatus.RUNNING });
        try {
            const result = await this.ai.transcribe(recording.objectKey, `asr-${recordingId}`);
            this.store.updateAsrJob(job.id, {
                status: shared_types_1.AsrJobStatus.SUCCESS,
                text: result.text,
                segments: result.segments
            });
        }
        catch (error) {
            this.store.updateAsrJob(job.id, {
                status: shared_types_1.AsrJobStatus.FAILED,
                errorMessage: error.message
            });
        }
        return this.store.getAsrJobById(job.id);
    }
    getAsrJob(practiceId, jobId) {
        const job = this.store.getAsrJobById(jobId);
        if (!job || job.practiceId !== practiceId) {
            throw new common_1.NotFoundException('ASR job not found');
        }
        return job;
    }
    async polish(practiceId, sourceText) {
        const practice = this.store.getPracticeById(practiceId);
        if (!practice) {
            throw new common_1.NotFoundException('Practice not found');
        }
        await this.ai.polish(sourceText, `polish-${practiceId}`);
        const { polishedText, changes } = this.store.buildPolishResult(sourceText);
        this.store.createPolish(practiceId, sourceText, polishedText, changes);
        return {
            sourceText,
            polishedText,
            changes
        };
    }
};
exports.PracticeService = PracticeService;
exports.PracticeService = PracticeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [store_service_1.InMemoryStoreService,
        ai_service_1.AIService])
], PracticeService);
//# sourceMappingURL=practice.service.js.map