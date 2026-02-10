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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const store_service_1 = require("../store/store.service");
let AdminService = class AdminService {
    constructor(store) {
        this.store = store;
    }
    listPrompts(module) {
        return this.store.listPrompts(module);
    }
    listPromptAuditLogs(module) {
        return this.store.listPromptAuditLogs(module);
    }
    createPrompt(module, content, operator, publish) {
        return this.store.createPromptTemplate(module, content, operator, publish);
    }
    publishPrompt(id, operator) {
        const prompt = this.store.publishPromptTemplate(id, operator);
        if (!prompt) {
            throw new common_1.NotFoundException('Prompt template not found');
        }
        return prompt;
    }
    rollbackPrompt(module, version, operator) {
        const prompt = this.store.rollbackPromptTemplate(module, version, operator);
        if (!prompt) {
            throw new common_1.NotFoundException('Prompt template not found for target version');
        }
        return prompt;
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [store_service_1.InMemoryStoreService])
], AdminService);
//# sourceMappingURL=admin.service.js.map