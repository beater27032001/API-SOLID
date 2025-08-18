// Importa Zod para validação de schemas
import { z } from 'zod'
// Importa tipos do Fastify para request e response
import { FastifyReply, FastifyRequest } from 'fastify'
// Importa erro customizado para credenciais inválidas
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'
// Importa factory para criar instância do use case de autenticação
import { makeAuthenticateUseCase } from '@/use-cases/factories/make-authenticate-use-case'

// Controller responsável por autenticar usuários
export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  // Define o schema de validação para o corpo da requisição
  const authenticateBodySchema = z.object({
    email: z.string().email(), // Email deve ser uma string válida
    password: z.string().min(6), // Senha deve ter pelo menos 6 caracteres
  })

  // Valida e extrai os dados do corpo da requisição
  const { email, password } = authenticateBodySchema.parse(request.body)

  try {
    // Cria uma instância do use case de autenticação
    const authenticateUseCase = makeAuthenticateUseCase()

    // Executa a lógica de negócio para autenticar o usuário
    const { user } = await authenticateUseCase.execute({
      email,
      password,
    })

    // Gera o token JWT para o usuário autenticado
    const token = await reply.jwtSign(
      {},
      {
        sign: {
          sub: user.id,
        },
      },
    )

    // Retorna o token JWT no corpo da resposta
    return reply.status(200).send({
      token,
    })
  } catch (error) {
    // Se o erro for de credenciais inválidas, retorna 400 (Bad Request)
    if (error instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: error.message })
    }

    // Para outros erros, repassa para o handler global de erros
    throw error
  }
}
