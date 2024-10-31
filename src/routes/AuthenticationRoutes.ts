import { FastifyInstance } from 'fastify';
import { AuthenticationController } from '../controllers/AuthenticationController.js';
import { AuthenticationMiddleware } from '../middlewares/AuthenticationMiddleware.js';

export default async function (fastify: FastifyInstance) {
    const authenticationController = new AuthenticationController();

    fastify.post('/login', (request, reply) => authenticationController.login(request, reply));

    fastify.put(
        '/change-password',
        { preHandler: AuthenticationMiddleware },
        (request, reply) => authenticationController.changePassword(request, reply)
    );
}
