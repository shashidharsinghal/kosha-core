import mongoose from 'mongoose';
import { createConnection, Connection } from 'typeorm';
import { createClient, RedisClientType } from 'redis';

// MongoDB connection (for bills, expenses, incomes, notifications)
let mongoConnection: typeof mongoose | null = null;

export async function connectMongoDB(): Promise<void> {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/kosha';
    mongoConnection = await mongoose.connect(mongoUri);
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
}

export function getMongoConnection(): typeof mongoose {
  if (!mongoConnection) {
    throw new Error('MongoDB not connected');
  }
  return mongoConnection;
}

// PostgreSQL connection (for users, sessions, investments, payments)
let postgresConnection: Connection | null = null;

export async function connectPostgreSQL(): Promise<void> {
  try {
    // Support both POSTGRES_URL and individual connection parameters
    const connectionOptions = process.env.POSTGRES_URL
      ? {
          type: 'postgres' as const,
          url: process.env.POSTGRES_URL,
          synchronize: process.env.NODE_ENV !== 'production',
          logging: process.env.NODE_ENV === 'development',
          entities: [__dirname + '/../models/postgres/**/*.entity.{ts,js}'],
        }
      : {
          type: 'postgres' as const,
          host: process.env.POSTGRES_HOST || 'localhost',
          port: parseInt(process.env.POSTGRES_PORT || '5432'),
          username: process.env.POSTGRES_USER || 'postgres',
          password: process.env.POSTGRES_PASSWORD || 'postgres',
          database: process.env.POSTGRES_DB || 'kosha',
          synchronize: process.env.NODE_ENV !== 'production',
          logging: process.env.NODE_ENV === 'development',
          entities: [__dirname + '/../models/postgres/**/*.entity.{ts,js}'],
        };

    postgresConnection = await createConnection(connectionOptions);
    console.log('✅ PostgreSQL connected');
  } catch (error) {
    console.error('❌ PostgreSQL connection error:', error);
    throw error;
  }
}

export function getPostgresConnection(): Connection {
  if (!postgresConnection) {
    throw new Error('PostgreSQL not connected');
  }
  return postgresConnection;
}

// Redis connection (for caching)
let redisClient: RedisClientType | null = null;

export async function connectRedis(): Promise<void> {
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

    redisClient = createClient(redisConfig);

    redisClient.on('error', (err) => console.error('Redis Client Error', err));
    await redisClient.connect();
    console.log('✅ Redis connected');
  } catch (error) {
    console.error('❌ Redis connection error:', error);
    throw error;
  }
}

export function getRedisClient(): RedisClientType {
  if (!redisClient) {
    throw new Error('Redis not connected');
  }
  return redisClient;
}

// Initialize all connections
export async function initializeDatabases(): Promise<void> {
  await Promise.all([
    connectMongoDB(),
    connectPostgreSQL(),
    connectRedis(),
  ]);
}

