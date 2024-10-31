import { RedisService } from './RedisService.js';

export class SessionService {
    private redisService: RedisService;

    constructor() {
        this.redisService = RedisService.getInstance();
    }

    async createSession(userId: number): Promise<string> {
        const sessionId = generateRandomString();
        await this.redisService.set(`session:${sessionId}`, userId.toString());
        return sessionId;
    }

    async getUserId(sessionId: string): Promise<number | null> {
        const userId = await this.redisService.get(`session:${sessionId}`);
        return userId ? parseInt(userId) : null;
    }

    async destroySession(sessionId: string): Promise<void> {
        await this.redisService.del(`session:${sessionId}`);
    }
}

function generateRandomString(): string {
    return Math.random().toString(36).substring(2, 15);
}
