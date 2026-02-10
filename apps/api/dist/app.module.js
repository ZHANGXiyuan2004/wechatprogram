"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const admin_module_1 = require("./admin/admin.module");
const ai_module_1 = require("./ai/ai.module");
const auth_module_1 = require("./auth/auth.module");
const data_module_1 = require("./data/data.module");
const manager_module_1 = require("./manager/manager.module");
const practice_module_1 = require("./practice/practice.module");
const retention_module_1 = require("./retention/retention.module");
const store_module_1 = require("./store/store.module");
const sync_module_1 = require("./sync/sync.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            store_module_1.InMemoryStoreModule,
            ai_module_1.AiModule,
            auth_module_1.AuthModule,
            practice_module_1.PracticeModule,
            manager_module_1.ManagerModule,
            admin_module_1.AdminModule,
            data_module_1.DataModule,
            sync_module_1.SyncModule,
            retention_module_1.RetentionModule
        ]
    })
], AppModule);
//# sourceMappingURL=app.module.js.map