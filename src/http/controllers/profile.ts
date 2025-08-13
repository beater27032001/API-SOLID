import { FastifyReply, FastifyRequest } from 'fastify'

// Controller responsável por obter informações do perfil do usuário logado
export async function profile(request: FastifyRequest, reply: FastifyReply) {
  // Verifica se o usuário está autenticado
  await request.jwtVerify()

  // Retorna o usuário autenticado
  return reply.status(200).send()
}
