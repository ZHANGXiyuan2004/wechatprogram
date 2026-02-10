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
exports.RetentionController = void 0;
const common_1 = require("@nestjs/common");
const shared_types_1 = require("@asrllm/shared-types");
const swagger_1 = require("@nestjs/swagger");
const auth_guard_1 = require("../common/auth.guard");
const roles_decorator_1 = require("../common/roles.decorator");
const roles_guard_1 = require("../common/roles.guard");
const retention_service_1 = require("./retention.service");
let RetentionController = class RetentionController {
    constructor(retentionService) {
        this.retentionService = retentionService;
    }
    cleanup(days) {
        const dayNum = Number(days || '90');
        return this.retentionService.cleanup(Number.isFinite(dayNum) ? dayNum : 90);
    }
};
exports.RetentionController = RetentionController;
__decorate([
    (0, common_1.Post)('cleanup'),
    (0, swagger_1.ApiOperation)({ summary: '执行90天数据留存清理任务' }),
    __param(0, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RetentionController.prototype, "cleanup", null);
exports.RetentionController = RetentionController = __decorate([
    (0, swagger_1.ApiTags)('retention'),
    (0, common_1.Controller)('admin/retention'),
    (0, common_1.UseGuards)(auth_guard_1.MockAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_types_1.Role.ADMIN),
    __metadata("design:paramtypes", [retention_service_1.RetentionService])
], RetentionController);
//# sourceMappingURL=retention.controller.js.map