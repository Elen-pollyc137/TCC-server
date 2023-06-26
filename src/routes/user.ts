import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { prisma } from '../lib/prisma'
import { z } from 'zod'

const jwt = require('jsonwebtoken')

export async function userRoutes(app: FastifyInstance) {
  app.get('/users', async (request: FastifyRequest, reply: FastifyReply) => {
    const users = await prisma.user.findMany()

    return users.map((user) => {
      return reply.send(users)
    })
  })

  app.post('/users', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const bodySchema = z.object({
        name: z.string(),
        email: z.string(),
        password: z.string(),
      })
      const { name, email, password } = bodySchema.parse(request.body)

      const generateToken = (): string => {
        const payload = {
          userId: 123,
          username: 'example',
        }

        const token = jwt.sign(payload, 'secret-key', {
          expiresIn: '1h',
        })

        return token
      }
      const createdUser = await prisma.user.create({
        data: {
          name,
          email,
          password,
          token: generateToken(), // Fornecer um valor padrão para o token
        },
      })

      reply.send(createdUser)
    } catch (error) {
      console.error(error)
      reply.status(500).send({ error: 'Internal Server Error' })
    }
  })
}
