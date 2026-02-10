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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PracticeController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const rxjs_1 = require("rxjs");
const auth_guard_1 = require("../common/auth.guard");
const user_decorator_1 = require("../common/user.decorator");
const practice_service_1 = require("./practice.service");
const practice_dto_1 = require("./practice.dto");
let PracticeController = class PracticeController {
    constructor(service) {
        this.service = service;
    }
    createPractice(user, body) {
        return this.service.createPractice(user.id, body.topic);
    }
    generateOutline(id, body) {
        return this.service.generateOutline(id, body);
    }
    streamOutline(id) {
        const generator = this.service.streamOutline(id);
        return new rxjs_1.Observable((subscriber) => {
            (async () => {
                try {
                    for await (const chunk of generator) {
                        subscriber.next({ data: { chunk } });
                    }
                    subscriber.next({ data: { done: true } });
                    subscriber.complete();
                }
                catch (error) {
                    subscriber.error(error);
                }
            })();
        });
    }
    createRecordingPresign(id, body) {
        return this.service.createRecordingPresign(id, body);
    }
    createAsrJob(id, body) {
        return this.service.createAsrJob(id, body.recordingId);
    }
    getAsrJob(id, jobId) {
        return this.service.getAsrJob(id, jobId);
    }
    polish(id, body) {
        return this.service.polish(id, body.sourceText);
    }
};
exports.PracticeController = PracticeController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: '创建练习草稿' }),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, practice_dto_1.CreatePracticeDto]),
    __metadata("design:returntype", void 0)
], PracticeController.prototype, "createPractice", null);
__decorate([
    (0, common_1.Post)(':id/outline/generate'),
    (0, swagger_1.ApiOperation)({ summary: '触发大纲生成' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, practice_dto_1.GenerateOutlineDto]),
    __metadata("design:returntype", void 0)
], PracticeController.prototype, "generateOutline", null);
__decorate([
    (0, common_1.Sse)(':id/outline/stream'),
    (0, swagger_1.ApiOperation)({ summary: 'SSE流式返回大纲内容' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", rxjs_1.Observable)
], PracticeController.prototype, "streamOutline", null);
__decorate([
    (0, common_1.Post)(':id/recordings/presign'),
    (0, swagger_1.ApiOperation)({ summary: '获取录音上传签名' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, practice_dto_1.PresignRecordingDto]),
    __metadata("design:returntype", void 0)
], PracticeController.prototype, "createRecordingPresign", null);
__decorate([
    (0, common_1.Post)(':id/asr/jobs'),
    (0, swagger_1.ApiOperation)({ summary: '发起ASR任务' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, practice_dto_1.CreateAsrJobDto]),
    __metadata("design:returntype", void 0)
], PracticeController.prototype, "createAsrJob", null);
__decorate([
    (0, common_1.Get)(':id/asr/jobs/:jobId'),
    (0, swagger_1.ApiOperation)({ summary: '查询ASR任务状态' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('jobId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], PracticeController.prototype, "getAsrJob", null);
__decorate([
    (0, common_1.Post)(':id/polish'),
    (0, swagger_1.ApiOperation)({ summary: '生成表达优化与Diff' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, practice_dto_1.PolishDto]),
    __metadata("design:returntype", void 0)
], PracticeController.prototype, "polish", null);
exports.PracticeController = PracticeController = __decorate([
    (0, swagger_1.ApiTags)('practice'),
    (0, common_1.UseGuards)(auth_guard_1.MockAuthGuard),
    (0, common_1.Controller)('practices'),
    __metadata("design:paramtypes", [practice_service_1.PracticeService])
], PracticeController);
//# sourceMappingURL=practice.controller.js.map