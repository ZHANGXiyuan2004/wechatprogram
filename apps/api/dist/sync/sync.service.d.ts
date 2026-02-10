export declare class SyncService {
    private readonly logger;
    syncWecomOrg(): Promise<{
        synced: number;
        timestamp: string;
    }>;
}
