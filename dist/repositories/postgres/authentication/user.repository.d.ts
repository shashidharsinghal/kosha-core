import { User } from '../../../models/postgres/authentication/user.entity';
export declare class UserRepository {
    private repository;
    private getRepository;
    create(userData: Partial<User>): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    update(id: string, updates: Partial<User>): Promise<User>;
    delete(id: string): Promise<void>;
}
//# sourceMappingURL=user.repository.d.ts.map