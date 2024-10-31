import { createClient, RedisClientType } from 'redis';
import { redisConfig } from '../config/redis.js';

export class RedisService {
    private static instance: RedisService;
    private client: RedisClientType;

    private constructor() {
        this.client = createClient(redisConfig);

        this.client.on('error', (err: any) => {
            console.error('Redis Client Error', err);
        });
    }

    public static getInstance(): RedisService {
        if (!RedisService.instance) {
            RedisService.instance = new RedisService();
        }
        return RedisService.instance;
    }

    public async connect(): Promise<void> {
        if (!this.client.isOpen) {
            await this.client.connect();
        }
    }

    public async disconnect(): Promise<void> {
        if (this.client.isOpen) {
            await this.client.disconnect();
        }
    }

    public async get(key: string): Promise<string | null> {
        return await this.client.get(key);
    }

    public async set(key: string, value: string): Promise<void> {
        await this.client.set(key, value);
    }

    public async del(key: string): Promise<void> {
        await this.client.del(key);
    }
}
