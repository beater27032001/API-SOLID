import { makeGetUserProfileUseCase } from '@/use-cases/factories/make-get-user-profile-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'

// Controller responsável por obter informações do perfil do usuário logado
export async function profile(request: FastifyRequest, reply: FastifyReply) {
  // Cria uma instância do use case de obtenção do perfil do usuário
  const getUserProfileUseCase = makeGetUserProfileUseCase()

  // Executa a lógica de negócio para obter o perfil do usuário
  const { user } = await getUserProfileUseCase.execute({
    userId: request.user.sub,
  })

  // Retorna o usuário autenticado
  return reply.status(200).send({
    user: {
      ...user,
      password_hash: undefined,
    },
  })
}
