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
exports.DataController = void 0;
const common_1 = require("@nestjs/common");
const shared_types_1 = require("@asrllm/shared-types");
const swagger_1 = require("@nestjs/swagger");
const auth_guard_1 = require("../common/auth.guard");
const roles_decorator_1 = require("../common/roles.decorator");
const roles_guard_1 = require("../common/roles.guard");
const data_service_1 = require("./data.service");
let DataController = class DataController {
    constructor(dataService) {
        this.dataService = dataService;
    }
    deleteData(entity, id) {
        return this.dataService.createDeleteJob(entity, id);
    }
};
exports.DataController = DataController;
__decorate([
    (0, common_1.Delete)(':entity/:id'),
    (0, swagger_1.ApiOperation)({ summary: '发起物理删除任务' }),
    __param(0, (0, common_1.Param)('entity')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], DataController.prototype, "deleteData", null);
exports.DataController = DataController = __decorate([
    (0, swagger_1.ApiTags)('data'),
    (0, common_1.Controller)('data'),
    (0, common_1.UseGuards)(auth_guard_1.MockAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_types_1.Role.ADMIN),
    __metadata("design:paramtypes", [data_service_1.DataService])
], DataController);
//# sourceMappingURL=data.controller.js.map