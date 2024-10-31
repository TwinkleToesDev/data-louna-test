import 'fastify';
import { RedisService } from './services/RedisService';

declare module 'fastify' {
    interface FastifyRequest {
        userId?: number;
    }
    interface FastifyInstance {
        redis: RedisService;
    }
}
