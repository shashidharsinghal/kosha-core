"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectMongoDB = connectMongoDB;
exports.getMongoConnection = getMongoConnection;
exports.connectPostgreSQL = connectPostgreSQL;
exports.getPostgresConnection = getPostgresConnection;
exports.connectRedis = connectRedis;
exports.getRedisClient = getRedisClient;
exports.initializeDatabases = initializeDatabases;
const mongoose_1 = __importDefault(require("mongoose"));
const typeorm_1 = require("typeorm");
const redis_1 = require("redis");
// MongoDB connection (for bills, expenses, incomes, notifications)
let mongoConnection = null;
async function connectMongoDB() {
    try {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/kosha';
        mongoConnection = await mongoose_1.default.connect(mongoUri);
        console.log('✅ MongoDB connected');
    }
    catch (error) {
        console.error('❌ MongoDB connection error:', error);
        throw error;
    }
}
function getMongoConnection() {
    if (!mongoConnection) {
        throw new Error('MongoDB not connected');
    }
    return mongoConnection;
}
// PostgreSQL connection (for users, sessions, investments, payments)
let postgresConnection = null;
async function connectPostgreSQL() {
    try {
        // Support both POSTGRES_URL and individual connection parameters
        const connectionOptions = process.env.POSTGRES_URL
            ? {
                type: 'postgres',
                url: process.env.POSTGRES_URL,
                synchronize: process.env.NODE_ENV !== 'production',
                logging: process.env.NODE_ENV === 'development',
                entities: [__dirname + '/../models/postgres/**/*.entity.{ts,js}'],
            }
            : {
                type: 'postgres',
                host: process.env.POSTGRES_HOST || 'localhost',
                port: parseInt(process.env.POSTGRES_PORT || '5432'),
                username: process.env.POSTGRES_USER || 'postgres',
                password: process.env.POSTGRES_PASSWORD || 'postgres',
                database: process.env.POSTGRES_DB || 'kosha',
                synchronize: process.env.NODE_ENV !== 'production',
                logging: process.env.NODE_ENV === 'development',
                entities: [__dirname + '/../models/postgres/**/*.entity.{ts,js}'],
            };
        postgresConnection = await (0, typeorm_1.createConnection)(connectionOptions);
        console.log('✅ PostgreSQL connected');
    }
    catch (error) {
        console.error('❌ PostgreSQL connection error:', error);
        throw error;
    }
}
function getPostgresConnection() {
    if (!postgresConnection) {
        throw new Error('PostgreSQL not connected');
    }
    return postgresConnection;
}
// Redis connection (for caching)
let redisClient = null;
async function connectRedis() {
    try {
        // Support both REDIS_URL and individual connection parameters
        const redisConfig = process.env.REDIS_URL
            ? {
                url: process.env.REDIS_URL,
            }
            : {
                socket: {
                    host: process.env.REDIS_HOST || 'localhost',
                    port: parseInt(process.env.REDIS_PORT || '6379'),
                },
                ...(process.env.REDIS_PASSWORD && { password: process.env.REDIS_PASSWORD }),
            };
        redisClient = (0, redis_1.createClient)(redisConfig);
        redisClient.on('error', (err) => console.error('Redis Client Error', err));
        await redisClient.connect();
        console.log('✅ Redis connected');
    }
    catch (error) {
        console.error('❌ Redis connection error:', error);
        throw error;
    }
}
function getRedisClient() {
    if (!redisClient) {
        throw new Error('Redis not connected');
    }
    return redisClient;
}
// Initialize all connections
async function initializeDatabases() {
    await Promise.all([
        connectMongoDB(),
        connectPostgreSQL(),
        connectRedis(),
    ]);
}
//# sourceMappingURL=database.js.map