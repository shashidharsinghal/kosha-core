import { User } from '../../models/postgres/authentication/user.entity';
export declare class AuthService {
    private userRepository;
    private sessionRepository;
    constructor();
    register(email: string, password: string, name?: string): Promise<User>;
    login(email: string, password: string): Promise<{
        token: string;
        refreshToken: string;
        user: User;
    }>;
    refresh(refreshToken: string): Promise<{
        token: string;
        refreshToken: string;
    }>;
    logout(refreshToken: string): Promise<{
        success: boolean;
    }>;
    linkGmail(userId: string, oauthCode: string): Promise<{
        success: boolean;
    }>;
    private generateTokens;
    private createSession;
}
//# sourceMappingURL=auth.service.d.ts.map