import { Asset } from '../../../models/postgres/investments/asset.entity';
export declare class AssetRepository {
    private repository;
    private getRepository;
    create(assetData: Partial<Asset>): Promise<Asset>;
    findById(id: string): Promise<Asset | null>;
    findByUserId(userId: string, type?: string): Promise<Asset[]>;
    update(id: string, updates: Partial<Asset>): Promise<Asset>;
    delete(id: string): Promise<void>;
}
//# sourceMappingURL=asset.repository.d.ts.map