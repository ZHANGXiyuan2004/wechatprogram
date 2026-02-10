import { Injectable } from '@nestjs/common';
import { InMemoryStoreService } from '../store/store.service';

@Injectable()
export class DataService {
  constructor(private readonly store: InMemoryStoreService) {}

  createDeleteJob(entity: string, id: string) {
    return this.store.createDeletionJob(entity, id);
  }
}
