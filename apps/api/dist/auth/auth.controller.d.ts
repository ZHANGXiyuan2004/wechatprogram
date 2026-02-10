import { AuthService } from './auth.service';
declare class WecomLoginDto {
    code: string;
}
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(body: WecomLoginDto): Promise<{
        accessToken: string;
        user: import("@asrllm/shared-types").UserProfile;
    }>;
}
export {};
