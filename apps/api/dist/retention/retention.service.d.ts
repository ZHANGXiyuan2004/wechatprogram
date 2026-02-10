import { InMemoryStoreService } from '../store/store.service';
export declare class RetentionService {
    private readonly store;
    private readonly logger;
    constructor(store: InMemoryStoreService);
    cleanup(days?: number): {
        cleanedPracticeCount: number;
        days: number;
        at: string;
    };
}
