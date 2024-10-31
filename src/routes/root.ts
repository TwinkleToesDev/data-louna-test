'use strict'
import { FastifyInstance, FastifyPluginAsync } from 'fastify';

const root: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  fastify.get('/', async () => {
    return { response: "OK" }
  })
}

export default root;
