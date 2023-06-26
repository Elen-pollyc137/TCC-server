import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from '../lib/prisma'

export async function familyReferenceRoutes(app: FastifyInstance) {
  // Buscar todos os usuario
  app.get('/register', async (request: FastifyRequest, reply: FastifyReply) => {
    const users = await prisma.familyreference.findMany()

    return users.map((familyreference) => {
      return reply.send(users)
    })
  })
  // Criar um novo usuario
  app.post(
    '/register',
    async (request: FastifyRequest, reply: FastifyReply) => {},
  )
  // Editar um novo usuario
  app.put(
    '/register',
    async (request: FastifyRequest, reply: FastifyReply) => {},
  )
}
