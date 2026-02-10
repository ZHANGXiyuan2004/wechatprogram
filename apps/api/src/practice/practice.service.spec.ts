import { Test } from '@nestjs/testing';
import { OutlineStyle } from '@asrllm/shared-types';
import { AiModule } from '../ai/ai.module';
import { InMemoryStoreModule } from '../store/store.module';
import { PracticeService } from './practice.service';

describe('PracticeService', () => {
  let service: PracticeService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [InMemoryStoreModule, AiModule],
      providers: [PracticeService]
    }).compile();

    service = moduleRef.get(PracticeService);
  });

  it('creates practice and generates outline', async () => {
    const practice = service.createPractice('u-emp-001', '季度经营汇报');
    const outline = await service.generateOutline(practice.id, {
      style: OutlineStyle.STRUCTURED,
      level: 'P5',
      backgroundTags: ['SaaS']
    });

    expect(outline.practiceId).toBe(practice.id);
    expect(outline.content.length).toBeGreaterThan(0);
  });
});
