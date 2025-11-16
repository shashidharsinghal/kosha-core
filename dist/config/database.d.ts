import mongoose from 'mongoose';
import { Connection } from 'typeorm';
import { RedisClientType } from 'redis';
export declare function connectMongoDB(): Promise<void>;
export declare function getMongoConnection(): typeof mongoose;
export declare function connectPostgreSQL(): Promise<void>;
export declare function getPostgresConnection(): Connection;
export declare function connectRedis(): Promise<void>;
export declare function getRedisClient(): RedisClientType;
export declare function initializeDatabases(): Promise<void>;
//# sourceMappingURL=database.d.ts.map