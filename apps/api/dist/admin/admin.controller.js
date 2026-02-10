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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const shared_types_1 = require("@asrllm/shared-types");
const swagger_1 = require("@nestjs/swagger");
const auth_guard_1 = require("../common/auth.guard");
const user_decorator_1 = require("../common/user.decorator");
const roles_decorator_1 = require("../common/roles.decorator");
const roles_guard_1 = require("../common/roles.guard");
const admin_dto_1 = require("./admin.dto");
const admin_service_1 = require("./admin.service");
let AdminController = class AdminController {
    constructor(adminService) {
        this.adminService = adminService;
    }
    listPrompts(module) {
        return {
            templates: this.adminService.listPrompts(module),
            auditLogs: this.adminService.listPromptAuditLogs(module)
        };
    }
    createPrompt(user, body) {
        return this.adminService.createPrompt(body.module, body.content, user.name, body.publish);
    }
    publishPrompt(user, id) {
        return this.adminService.publishPrompt(id, user.name);
    }
    rollbackPrompt(user, body) {
        return this.adminService.rollbackPrompt(body.module, body.version, user.name);
    }
    rollbackPromptCompat(user, body) {
        return this.adminService.rollbackPrompt(body.module, body.version, user.name);
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('prompts'),
    (0, swagger_1.ApiOperation)({ summary: '查询Prompt模板列表' }),
    __param(0, (0, common_1.Query)('module')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "listPrompts", null);
__decorate([
    (0, common_1.Post)('prompts'),
    (0, swagger_1.ApiOperation)({ summary: '创建Prompt模板版本' }),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, admin_dto_1.CreatePromptTemplateDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "createPrompt", null);
__decorate([
    (0, common_1.Post)('prompts/:id/publish'),
    (0, swagger_1.ApiOperation)({ summary: '发布Prompt版本' }),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "publishPrompt", null);
__decorate([
    (0, common_1.Post)('prompts/rollback'),
    (0, swagger_1.ApiOperation)({ summary: '按模块版本回滚Prompt' }),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, admin_dto_1.RollbackPromptTemplateDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "rollbackPrompt", null);
__decorate([
    (0, common_1.Post)('prompts/:id/rollback'),
    (0, swagger_1.ApiOperation)({ summary: '兼容路径：按模块版本回滚Prompt' }),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, admin_dto_1.RollbackPromptTemplateDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "rollbackPromptCompat", null);
exports.AdminController = AdminController = __decorate([
    (0, swagger_1.ApiTags)('admin'),
    (0, common_1.Controller)('admin'),
    (0, common_1.UseGuards)(auth_guard_1.MockAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_types_1.Role.ADMIN),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map