import fastify from 'fastify'
import { prisma } from './lib/prisma'
import { userRoutes } from './routes/user'
import { authRoutes } from './routes/auth'
const connectDatabase = require('../database/db')

const app = fastify()

app.register(userRoutes)
app.register(authRoutes)
connectDatabase()

app
  .listen({
    port: 3333,
  })

  .then(async () => {
    await prisma.$disconnect()
    console.log('🚀 ~ file: server.ts:17 ~ port:')
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
