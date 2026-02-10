"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const shared_types_1 = require("@asrllm/shared-types");
let MockAuthGuard = class MockAuthGuard {
    canActivate(context) {
        const req = context.switchToHttp().getRequest();
        const headers = req.headers;
        const roleHeader = String(headers['x-role'] || shared_types_1.Role.EMPLOYEE).toUpperCase();
        const role = Object.values(shared_types_1.Role).includes(roleHeader) ? roleHeader : shared_types_1.Role.EMPLOYEE;
        req.user = {
            id: String(headers['x-user-id'] || 'u-emp-001'),
            name: String(headers['x-user-name'] || '演示员工'),
            role,
            departmentId: String(headers['x-department-id'] || 'dep-001'),
            departmentName: String(headers['x-department-name'] || '产品研发部')
        };
        return true;
    }
};
exports.MockAuthGuard = MockAuthGuard;
exports.MockAuthGuard = MockAuthGuard = __decorate([
    (0, common_1.Injectable)()
], MockAuthGuard);
//# sourceMappingURL=auth.guard.js.map