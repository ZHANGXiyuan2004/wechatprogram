import { UserProfile } from '@asrllm/shared-types';
import { InMemoryStoreService } from '../store/store.service';
export declare class AuthService {
    private readonly store;
    constructor(store: InMemoryStoreService);
    wecomLogin(code: string): Promise<{
        accessToken: string;
        user: UserProfile;
    }>;
}
