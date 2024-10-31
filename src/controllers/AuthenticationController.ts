import { FastifyReply, FastifyRequest } from 'fastify';
import { AuthenticationService } from '../services/AuthenticationService.js';
import { UserRepository } from '../repositories/UserRepository.js';
import { SessionService } from '../services/SessionService.js';

export class AuthenticationController {
    private authenticationService: AuthenticationService;
    private sessionService: SessionService;

    constructor() {
        const userRepository = new UserRepository();
        this.authenticationService = new AuthenticationService(userRepository);
        this.sessionService = new SessionService();
    }

    async login(request: FastifyRequest, reply: FastifyReply) {
        const { username, password } = request.body as { username: string; password: string };

        const user = await this.authenticationService.authenticate(username, password);

        if (user) {
            const sessionId = await this.sessionService.createSession(user.id);
            reply.setCookie('sessionId', sessionId, { httpOnly: true });
            reply.send({
                status: 'success',
                data: {
                    user: {
                        id: user.id,
                        username: user.username,
                        name: user.name,
                        email: user.email,
                    },
                },
                message: "User logged in successfully"
            });
        } else {
            reply.status(401).send({ message: 'Invalid username or password' });
        }
    }

    async changePassword(request: FastifyRequest, reply: FastifyReply) {
        const userId = request.userId;
        if (!userId) {
            reply.status(401).send({ message: 'Unauthorized' });
            return;
        }

        const { currentPassword, newPassword } = request.body as {
            currentPassword: string;
            newPassword: string;
        };

        try {
            await this.authenticationService.changePassword(
                userId,
                currentPassword,
                newPassword
            );
            reply.send({ message: 'Password changed successfully' });
        } catch (error: any) {
            reply.status(400).send({ message: error.message });
        }
    }
}
