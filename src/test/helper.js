'use strict';

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Fastify from 'fastify';
import { buildApp } from '../app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function build(t) {
  const app = Fastify();

  await app.register(buildApp);

  const redisService = RedisService.getInstance();
  await redisService.connect();

  t.after(() => app.close());

  return app;
}

export { build };
