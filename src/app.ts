import fastify from 'fastify'
import { PrismaClient } from 'generated/prisma'

export const app = fastify()

const prisma = new PrismaClient()

prisma.user.create({
  data: {
    name: 'José Carlos',
    email: 'josecarlos@gmail.com',
    password_hash: 'your_password_hash_here',
  },
})
