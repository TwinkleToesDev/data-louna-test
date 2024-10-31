import { FastifyInstance } from 'fastify';
import { ItemController } from '../controllers/ItemController.js';

export default async function (fastify: FastifyInstance) {
    const itemController = new ItemController();

    fastify.get('/items', (request, reply) => itemController.getItems(request, reply));
}

