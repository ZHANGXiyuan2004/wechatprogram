import { InMemoryStoreService } from '../store/store.service';
export declare class DataService {
    private readonly store;
    constructor(store: InMemoryStoreService);
    createDeleteJob(entity: string, id: string): import("../store/store.service").DeletionJob;
}
