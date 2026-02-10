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
exports.RollbackPromptDto = exports.PolishDto = exports.CreateAsrJobDto = exports.PresignRecordingDto = exports.GenerateOutlineDto = exports.CreatePracticeDto = void 0;
const shared_types_1 = require("@asrllm/shared-types");
const class_validator_1 = require("class-validator");
class CreatePracticeDto {
}
exports.CreatePracticeDto = CreatePracticeDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePracticeDto.prototype, "topic", void 0);
class GenerateOutlineDto {
}
exports.GenerateOutlineDto = GenerateOutlineDto;
__decorate([
    (0, class_validator_1.IsEnum)(shared_types_1.OutlineStyle),
    __metadata("design:type", String)
], GenerateOutlineDto.prototype, "style", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GenerateOutlineDto.prototype, "level", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], GenerateOutlineDto.prototype, "backgroundTags", void 0);
class PresignRecordingDto {
}
exports.PresignRecordingDto = PresignRecordingDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PresignRecordingDto.prototype, "fileName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PresignRecordingDto.prototype, "contentType", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(300),
    __metadata("design:type", Number)
], PresignRecordingDto.prototype, "durationSec", void 0);
class CreateAsrJobDto {
}
exports.CreateAsrJobDto = CreateAsrJobDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAsrJobDto.prototype, "recordingId", void 0);
class PolishDto {
}
exports.PolishDto = PolishDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PolishDto.prototype, "sourceText", void 0);
class RollbackPromptDto {
}
exports.RollbackPromptDto = RollbackPromptDto;
__decorate([
    (0, class_validator_1.IsEnum)(shared_types_1.PromptModule),
    __metadata("design:type", String)
], RollbackPromptDto.prototype, "module", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], RollbackPromptDto.prototype, "version", void 0);
//# sourceMappingURL=practice.dto.js.map