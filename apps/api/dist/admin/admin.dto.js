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
exports.RollbackPromptTemplateDto = exports.CreatePromptTemplateDto = void 0;
const shared_types_1 = require("@asrllm/shared-types");
const class_validator_1 = require("class-validator");
class CreatePromptTemplateDto {
}
exports.CreatePromptTemplateDto = CreatePromptTemplateDto;
__decorate([
    (0, class_validator_1.IsEnum)(shared_types_1.PromptModule),
    __metadata("design:type", String)
], CreatePromptTemplateDto.prototype, "module", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePromptTemplateDto.prototype, "content", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreatePromptTemplateDto.prototype, "publish", void 0);
class RollbackPromptTemplateDto {
}
exports.RollbackPromptTemplateDto = RollbackPromptTemplateDto;
__decorate([
    (0, class_validator_1.IsEnum)(shared_types_1.PromptModule),
    __metadata("design:type", String)
], RollbackPromptTemplateDto.prototype, "module", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], RollbackPromptTemplateDto.prototype, "version", void 0);
//# sourceMappingURL=admin.dto.js.map