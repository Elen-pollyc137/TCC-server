import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'

import { z } from 'zod'
import bcrypt from 'bcrypt'
import { sign } from 'jsonwebtoken'
import { prisma } from '../lib/prisma'

export async function authRoutes(app: FastifyInstance) {
  // Rota de autenticação de usuário
  app.post(
    '/users/login',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const bodySchema = z.object({
          email: z.string(),
          password: z.string(),
        })
        const { email, password } = bodySchema.parse(request.body)

        // Verifica se o usuário existe no banco de dados
        const user = await prisma.user.findUnique({
          where: { email },
        })

        if (!user) {
          reply.status(401).send({ error: 'Usuário não encontrado' })
          return
        }
        // Verifica se a senha está correta

        const passwordMatches = await bcrypt.compare(password, user.password)

        if (!passwordMatches) {
          reply.status(401).send({ error: 'Credenciais inválidas' })
          return
        }

        // Gera o token de autenticação
        const token = sign({ userId: user.id }, 'seuSegredoAqui')

        // Atualiza o token no banco de dados
        const updatedUser = await prisma.user.update({
          where: { id: user.id },
          data: { token },
        })

        reply.send({ token })
        console.log(updatedUser)
      } catch (error) {
        console.error(error)
        reply.status(500).send({ error: 'Internal Server Error' })
      }
    },
  )
}
