import { FastifyRequest, FastifyReply } from 'fastify';
import { PurchaseService } from '../services/PurchaseService.js';

export class PurchaseController {
    private purchaseService: PurchaseService;

    constructor() {
        this.purchaseService = new PurchaseService();
    }

    async purchaseItem(request: FastifyRequest, reply: FastifyReply) {
        console.log('PurchaseController.purchaseItem');
        try {
            const userId = request.userId;
            if (!userId) {
                reply.status(401).send({ message: 'Unauthorized' });
                return;
            }

            const { itemId, quantity } = request.body as { itemId: number; quantity: number };

            const newBalance = await this.purchaseService.purchaseItem(userId, itemId, quantity);

            reply.send({ message: 'Purchase successful', balance: newBalance });
        } catch (error: any) {
            reply.status(400).send({ message: error.message });
        }
    }
}
