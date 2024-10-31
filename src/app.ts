import path from 'node:path';
import { fileURLToPath } from 'url';
import AutoLoad from '@fastify/autoload';
import fastify, { FastifyInstance } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import { RedisService } from "./services/RedisService.js";
import cookie from '@fastify/cookie';
import { startScheduler } from './config/scheduler.js';
import {ItemService} from "./services/ItemService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const buildApp = fastifyPlugin(async (fastify: FastifyInstance): Promise<void> => {
  await fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: {}
  });

  await fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    options: {}
  });
});

const start = async (): Promise<void> => {
  const server = fastify({
    logger: true
  });

  try {
    server.register(cookie);
    const redisService = RedisService.getInstance();
    await redisService.connect();

    const itemService = new ItemService();
    await itemService.fetchAndCacheItems();

    startScheduler();

    await server.register(buildApp);
    await server.listen({ port: 3000, host: '0.0.0.0' });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start().catch(console.error);
