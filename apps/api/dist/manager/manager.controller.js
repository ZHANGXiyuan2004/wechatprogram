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
exports.ManagerController = void 0;
const common_1 = require("@nestjs/common");
const shared_types_1 = require("@asrllm/shared-types");
const swagger_1 = require("@nestjs/swagger");
const auth_guard_1 = require("../common/auth.guard");
const roles_decorator_1 = require("../common/roles.decorator");
const roles_guard_1 = require("../common/roles.guard");
const manager_service_1 = require("./manager.service");
let ManagerController = class ManagerController {
    constructor(managerService) {
        this.managerService = managerService;
    }
    dashboard(departmentId, employeeName) {
        return this.managerService.getDashboard({ departmentId, employeeName });
    }
    records(departmentId, employeeName) {
        return this.managerService.getRecords({ departmentId, employeeName });
    }
    recordDetail(recordId) {
        const detail = this.managerService.getRecordDetail(recordId);
        if (!detail) {
            throw new common_1.NotFoundException('Record not found');
        }
        return detail;
    }
};
exports.ManagerController = ManagerController;
__decorate([
    (0, common_1.Get)('dashboard'),
    (0, swagger_1.ApiOperation)({ summary: '管理看板统计' }),
    __param(0, (0, common_1.Query)('departmentId')),
    __param(1, (0, common_1.Query)('employeeName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ManagerController.prototype, "dashboard", null);
__decorate([
    (0, common_1.Get)('records'),
    (0, swagger_1.ApiOperation)({ summary: '练习记录列表检索' }),
    __param(0, (0, common_1.Query)('departmentId')),
    __param(1, (0, common_1.Query)('employeeName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ManagerController.prototype, "records", null);
__decorate([
    (0, common_1.Get)('records/:recordId'),
    (0, swagger_1.ApiOperation)({ summary: '练习记录详情' }),
    __param(0, (0, common_1.Param)('recordId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ManagerController.prototype, "recordDetail", null);
exports.ManagerController = ManagerController = __decorate([
    (0, swagger_1.ApiTags)('manager'),
    (0, common_1.Controller)('manager'),
    (0, common_1.UseGuards)(auth_guard_1.MockAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_types_1.Role.MANAGER, shared_types_1.Role.ADMIN),
    __metadata("design:paramtypes", [manager_service_1.ManagerService])
], ManagerController);
//# sourceMappingURL=manager.controller.js.map