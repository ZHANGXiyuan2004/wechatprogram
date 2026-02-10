import { Injectable, Logger } from '@nestjs/common';
import { InMemoryStoreService } from '../store/store.service';

@Injectable()
export class RetentionService {
  private readonly logger = new Logger(RetentionService.name);

  constructor(private readonly store: InMemoryStoreService) {}

  cleanup(days = 90): { cleanedPracticeCount: number; days: number; at: string } {
    const cleanedPracticeCount = this.store.cleanupExpiredData(days);
    this.logger.log(`Retention cleanup finished, removed ${cleanedPracticeCount} practices`);

    return {
      cleanedPracticeCount,
      days,
      at: new Date().toISOString()
    };
  }
}
