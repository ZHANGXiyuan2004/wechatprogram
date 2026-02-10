import { DataService } from './data.service';
export declare class DataController {
    private readonly dataService;
    constructor(dataService: DataService);
    deleteData(entity: string, id: string): import("../store/store.service").DeletionJob;
}
