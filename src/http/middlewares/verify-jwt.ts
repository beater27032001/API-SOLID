import { FastifyRequest, FastifyReply } from 'fastify'

// Middleware para verificar se o usuário está autenticado
export async function verifyJwt(request: FastifyRequest, reply: FastifyReply) {
  try {
    // Verifica se o usuário está autenticado
    await request.jwtVerify()
  } catch (error) {
    // Se não estiver autenticado, retorna 401 (Unauthorized)
    return reply.status(401).send({ message: 'Unauthorized' })
  }
}
