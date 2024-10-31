import { FastifyRequest, FastifyReply } from 'fastify';
import { SessionService } from '../services/SessionService.js';

export async function AuthenticationMiddleware(
    request: FastifyRequest,
    reply: FastifyReply
) {
    const sessionId = request.cookies.sessionId;
    if (!sessionId) {
        reply.status(401).send({ message: 'Unauthorized' });
        return;
    }

    const sessionService = new SessionService();
    const userId = await sessionService.getUserId(sessionId);
    if (!userId) {
        reply.status(401).send({ message: 'Unauthorized' });
        return;
    }

    request.userId = userId;
}
