import { RetentionService } from './retention.service';
export declare class RetentionController {
    private readonly retentionService;
    constructor(retentionService: RetentionService);
    cleanup(days?: string): {
        cleanedPracticeCount: number;
        days: number;
        at: string;
    };
}
