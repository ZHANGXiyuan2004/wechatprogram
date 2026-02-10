"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const shared_types_1 = require("@asrllm/shared-types");
const ai_module_1 = require("../ai/ai.module");
const store_module_1 = require("../store/store.module");
const practice_service_1 = require("./practice.service");
describe('PracticeService', () => {
    let service;
    beforeEach(async () => {
        const moduleRef = await testing_1.Test.createTestingModule({
            imports: [store_module_1.InMemoryStoreModule, ai_module_1.AiModule],
            providers: [practice_service_1.PracticeService]
        }).compile();
        service = moduleRef.get(practice_service_1.PracticeService);
    });
    it('creates practice and generates outline', async () => {
        const practice = service.createPractice('u-emp-001', '季度经营汇报');
        const outline = await service.generateOutline(practice.id, {
            style: shared_types_1.OutlineStyle.STRUCTURED,
            level: 'P5',
            backgroundTags: ['SaaS']
        });
        expect(outline.practiceId).toBe(practice.id);
        expect(outline.content.length).toBeGreaterThan(0);
    });
});
//# sourceMappingURL=practice.service.spec.js.map