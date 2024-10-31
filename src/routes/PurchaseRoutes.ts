import { FastifyInstance } from 'fastify';
import { PurchaseController } from '../controllers/PurchaseController.js';
import { AuthenticationMiddleware } from '../middlewares/AuthenticationMiddleware.js';

export default async function (fastify: FastifyInstance) {
    const purchaseController = new PurchaseController();

    fastify.post(
        '/purchase',
        {
            preHandler: AuthenticationMiddleware,
            schema: {
                body: {
                    type: 'object',
                    required: ['itemId', 'quantity'],
                    properties: {
                        itemId: { type: 'number' },
                        quantity: { type: 'number', minimum: 1 },
                    },
                },
            },
        },
        (request, reply) => purchaseController.purchaseItem(request, reply)
    );
}
