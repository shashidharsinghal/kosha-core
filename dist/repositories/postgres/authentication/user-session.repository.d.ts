import { UserSession } from '../../../models/postgres/authentication/user-session.entity';
export declare class UserSessionRepository {
    private repository;
    private getRepository;
    create(sessionData: Partial<UserSession>): Promise<UserSession>;
    findByRefreshToken(refreshToken: string): Promise<UserSession | null>;
    findByUserId(userId: string): Promise<UserSession[]>;
    delete(refreshToken: string): Promise<void>;
    deleteExpired(): Promise<void>;
}
//# sourceMappingURL=user-session.repository.d.ts.map