'use strict'

import fastifyPlugin from 'fastify-plugin'

export default fastifyPlugin(async (fastify) => {
  fastify.decorate('someSupport', () => 'hugs')
})
